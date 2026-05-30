import { TextInput, NumberInput, Button, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function ProductForm({ initialValues, onSubmit, submitting }) {
  const form = useForm({
    initialValues: initialValues ?? {
      name: "",
      sku: "",
      price: 0,
      quantity: 0,
    },
    validate: {
      name: (v) => (v.trim().length > 0 ? null : "Name is required"),
      sku: (v) => (v.trim().length > 0 ? null : "SKU is required"),
      price: (v) => (v > 0 ? null : "Price must be greater than 0"),
      quantity: (v) => (v >= 0 ? null : "Quantity cannot be negative"),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput label="Name" placeholder="USB-C Cable" {...form.getInputProps("name")} />
        <TextInput label="SKU" placeholder="CBL-001" {...form.getInputProps("sku")} />
        <NumberInput
          label="Price"
          prefix="$"
          decimalScale={2}
          min={0}
          {...form.getInputProps("price")}
        />
        <NumberInput
          label="Quantity"
          min={0}
          allowDecimal={false}
          {...form.getInputProps("quantity")}
        />
        <Group justify="flex-end" mt="sm">
          <Button type="submit" loading={submitting}>
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
}