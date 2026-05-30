from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    # 1. Customer must exist.
    customer = db.get(Customer, payload.customer_id)
    if customer is None:
        raise HTTPException(
            status_code=404,
            detail=f"Customer {payload.customer_id} not found.",
        )

    # 2. Collapse duplicate product lines so "2 of X" and "3 of X" become "5 of X".
    requested: dict[int, int] = {}
    for line in payload.items:
        requested[line.product_id] = requested.get(line.product_id, 0) + line.quantity

    # 3. Validate every product and check stock BEFORE changing anything.
    #    Lock the rows so two simultaneous orders can't both pass the check.
    products: dict[int, Product] = {}
    for product_id, qty in requested.items():
        product = (
            db.query(Product)
            .filter(Product.id == product_id)
            .with_for_update()
            .first()
        )
        if product is None:
            raise HTTPException(status_code=404, detail=f"Product {product_id} not found.")
        if product.quantity < qty:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient stock for '{product.name}': "
                    f"requested {qty}, only {product.quantity} available."
                ),
            )
        products[product_id] = product

    # 4. All checks passed — build the order and deduct stock in one transaction.
    order = Order(customer_id=customer.id, status="completed")
    total = 0
    for product_id, qty in requested.items():
        product = products[product_id]
        product.quantity -= qty
        line_total = product.price * qty
        total += line_total
        order.items.append(
            OrderItem(
                product_id=product.id,
                quantity=qty,
                unit_price_snapshot=product.price,
            )
        )
    order.total_amount = total

    db.add(order)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create order; rolled back.")
    db.refresh(order)
    return order


@router.get("", response_model=list[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.id.desc()).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")
    return order