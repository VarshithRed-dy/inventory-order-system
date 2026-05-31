import { useState } from "react";
import {
  Title, Button, Group, Table, Modal, Skeleton, Text,
  Stack, Paper, Badge,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { fetchOrders, createOrder } from "../api/orders";
import { fetchCustomers } from "../api/customers";
import { fetchProducts } from "../api/products";
import OrderForm from "../components/OrderForm";

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewing, setViewing] = useState(null);

  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const customerName = (id) =>
    customers.find((c) => c.id === id)?.full_name ?? `Customer #${id}`;
  const productName = (id) =>
    products.find((p) => p.id === id)?.name ?? `Product #${id}`;

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Stock changed, so refresh products too.
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      notifications.show({ message: "Order placed", color: "teal" });
      setCreateOpen(false);
    },
    onError: (error) => {
      const detail = error?.response?.data?.detail ?? "Could not place order.";
      notifications.show({ message: detail, color: "red", autoClose: 6000 });
    },
  });

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Orders</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => setCreateOpen(true)}>
          Create Order
        </Button>
      </Group>

      {isLoading ? (
        <Stack>{[...Array(4)].map((_, i) => <Skeleton key={i} height={48} radius="sm" />)}</Stack>
      ) : orders.length === 0 ? (
        <Paper withBorder p="xl" radius="md">
          <Text ta="center" c="dimmed">No orders yet. Create one to see it here.</Text>
        </Paper>
      ) : (
        <Table striped highlightOnHover withTableBorder verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Items</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((o) => (
              <Table.Tr
                key={o.id}
                style={{ cursor: "pointer" }}
                onClick={() => setViewing(o)}
              >
                <Table.Td>#{o.id}</Table.Td>
                <Table.Td>{customerName(o.customer_id)}</Table.Td>
                <Table.Td>{o.items.length}</Table.Td>
                <Table.Td>${Number(o.total_amount).toFixed(2)}</Table.Td>
                <Table.Td>{new Date(o.created_at).toLocaleDateString()}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      {/* Create order modal */}
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Order"
        size="lg"
        centered
      >
        <OrderForm
          customers={customers}
          products={products}
          onSubmit={createMutation.mutate}
          submitting={createMutation.isPending}
        />
      </Modal>

      {/* Order details modal */}
      <Modal
        opened={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `Order #${viewing.id}` : ""}
        centered
      >
        {viewing && (
          <Stack>
            <Group justify="space-between">
              <Text c="dimmed">Customer</Text>
              <Text fw={500}>{customerName(viewing.customer_id)}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">Status</Text>
              <Badge variant="light">{viewing.status}</Badge>
            </Group>
            <Table withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Qty</Table.Th>
                  <Table.Th>Unit price</Table.Th>
                  <Table.Th>Line total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {viewing.items.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{productName(item.product_id)}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>${Number(item.unit_price_snapshot).toFixed(2)}</Table.Td>
                    <Table.Td>
                      ${(Number(item.unit_price_snapshot) * item.quantity).toFixed(2)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Group justify="flex-end">
              <Text fw={700}>Total: ${Number(viewing.total_amount).toFixed(2)}</Text>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}