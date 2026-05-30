import { useState } from "react";
import {
  Title,
  Button,
  Group,
  Table,
  Modal,
  TextInput,
  ActionIcon,
  Badge,
  Skeleton,
  Text,
  Stack,
  Paper,
} from "@mantine/core";
import { IconPlus, IconPencil, IconTrash, IconSearch } from "@tabler/icons-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import ProductForm from "../components/ProductForm";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = creating, object = editing

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Helper to refresh the list and show a toast after any change.
  const onSuccess = (message) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    notifications.show({ message, color: "teal" });
    setModalOpen(false);
    setEditing(null);
  };

  const onError = (error) => {
    const detail =
      error?.response?.data?.detail ?? "Something went wrong. Please try again.";
    notifications.show({ message: detail, color: "red" });
  };

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => onSuccess("Product created"),
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => onSuccess("Product updated"),
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => onSuccess("Product deleted"),
    onError,
  });

  const handleSubmit = (values) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(product.id);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Products</Title>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </Group>

      <TextInput
        placeholder="Search by name or SKU…"
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="md"
        maw={360}
      />

      {isLoading ? (
        <Stack>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={48} radius="sm" />
          ))}
        </Stack>
      ) : filtered.length === 0 ? (
        <Paper withBorder p="xl" radius="md">
          <Text ta="center" c="dimmed">
            {products.length === 0
              ? "No products yet. Click “Add Product” to create your first one."
              : "No products match your search."}
          </Text>
        </Paper>
      ) : (
        <Table striped highlightOnHover withTableBorder verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((p) => (
              <Table.Tr key={p.id}>
                <Table.Td>{p.name}</Table.Td>
                <Table.Td>{p.sku}</Table.Td>
                <Table.Td>${Number(p.price).toFixed(2)}</Table.Td>
                <Table.Td>
                  <Badge color={p.quantity < 10 ? "red" : "teal"} variant="light">
                    {p.quantity}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => {
                        setEditing(p);
                        setModalOpen(true);
                      }}
                    >
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(p)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Product" : "Add Product"}
        centered
      >
        <ProductForm
          initialValues={
            editing
              ? {
                  name: editing.name,
                  sku: editing.sku,
                  price: Number(editing.price),
                  quantity: editing.quantity,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          submitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </>
  );
}