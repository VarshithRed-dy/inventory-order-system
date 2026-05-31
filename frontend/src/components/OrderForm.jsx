import { useState } from "react";
import {
  Select, NumberInput, Button, Stack, Group, ActionIcon,
  Text, Divider, Paper,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

export default function OrderForm({ customers, products, onSubmit, submitting }) {
  const [customerId, setCustomerId] = useState(null);
  // Each row: { product_id: string|null, quantity: number }
  const [rows, setRows] = useState([{ product_id: null, quantity: 1 }]);
  const [error, setError] = useState(null);

  const productOptions = products.map((p) => ({
    value: String(p.id),
    label: `${p.name} (${p.quantity} in stock)`,
  }));
  const customerOptions = customers.map((c) => ({
    value: String(c.id),
    label: `${c.full_name} — ${c.email}`,
  }));

  const priceOf = (productId) => {
    const p = products.find((p) => String(p.id) === String(productId));
    return p ? Number(p.price) : 0;
  };

  const updateRow = (index, patch) => {
    setRows((rs) => rs.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };
  const addRow = () => setRows((rs) => [...rs, { product_id: null, quantity: 1 }]);
  const removeRow = (index) => setRows((rs) => rs.filter((_, i) => i !== index));

  const runningTotal = rows.reduce(
    (sum, r) => sum + (r.product_id ? priceOf(r.product_id) * r.quantity : 0),
    0
  );

  const handleSubmit = () => {
    setError(null);
    if (!customerId) return setError("Please select a customer.");
    const valid = rows.filter((r) => r.product_id && r.quantity > 0);
    if (valid.length === 0) return setError("Add at least one product.");
    onSubmit({
      customer_id: Number(customerId),
      items: valid.map((r) => ({
        product_id: Number(r.product_id),
        quantity: r.quantity,
      })),
    });
  };

  return (
    <Stack>
      <Select
        label="Customer"
        placeholder="Search and select…"
        searchable
        data={customerOptions}
        value={customerId}
        onChange={setCustomerId}
        nothingFoundMessage="No customers — add one first"
      />

      <Divider label="Items" labelPosition="left" />

      {rows.map((row, i) => (
        <Group key={i} align="flex-end" wrap="nowrap">
          <Select
            label={i === 0 ? "Product" : undefined}
            placeholder="Pick a product"
            searchable
            data={productOptions}
            value={row.product_id}
            onChange={(val) => updateRow(i, { product_id: val })}
            style={{ flex: 1 }}
          />
          <NumberInput
            label={i === 0 ? "Qty" : undefined}
            min={1}
            allowDecimal={false}
            value={row.quantity}
            onChange={(val) => updateRow(i, { quantity: Number(val) || 1 })}
            w={90}
          />
          <Text w={90} ta="right" fw={500} pb={6}>
            ${(row.product_id ? priceOf(row.product_id) * row.quantity : 0).toFixed(2)}
          </Text>
          <ActionIcon
            color="red"
            variant="subtle"
            mb={4}
            disabled={rows.length === 1}
            onClick={() => removeRow(i)}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      ))}

      <Button variant="light" leftSection={<IconPlus size={16} />} onClick={addRow} size="xs">
        Add another product
      </Button>

      <Paper withBorder p="md" radius="md" bg="var(--mantine-color-gray-0)">
        <Group justify="space-between">
          <Text fw={600}>Order total</Text>
          <Text fw={700} size="lg">${runningTotal.toFixed(2)}</Text>
        </Group>
      </Paper>

      {error && <Text c="red" size="sm">{error}</Text>}

      <Group justify="flex-end">
        <Button onClick={handleSubmit} loading={submitting}>Place order</Button>
      </Group>
    </Stack>
  );
}