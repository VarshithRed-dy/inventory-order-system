import { useState } from "react";
import {
  Title, Button, Group, Table, Modal, ActionIcon,
  Skeleton, Text, Stack, Paper,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { fetchCustomers, createCustomer, deleteCustomer } from "../api/customers";
import CustomerForm from "../components/CustomerForm";

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const onSuccess = (message) => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    notifications.show({ message, color: "teal" });
    setModalOpen(false);
  };
  const onError = (error) => {
    const detail = error?.response?.data?.detail ?? "Something went wrong.";
    notifications.show({ message: detail, color: "red" });
  };

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => onSuccess("Customer added"),
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => onSuccess("Customer deleted"),
    onError,
  });

  const handleDelete = (c) => {
    if (window.confirm(`Delete "${c.full_name}"?`)) deleteMutation.mutate(c.id);
  };

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Customers</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => setModalOpen(true)}>
          Add Customer
        </Button>
      </Group>

      {isLoading ? (
        <Stack>{[...Array(4)].map((_, i) => <Skeleton key={i} height={48} radius="sm" />)}</Stack>
      ) : customers.length === 0 ? (
        <Paper withBorder p="xl" radius="md">
          <Text ta="center" c="dimmed">No customers yet. Add your first one to start taking orders.</Text>
        </Paper>
      ) : (
        <Table striped highlightOnHover withTableBorder verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {customers.map((c) => (
              <Table.Tr key={c.id}>
                <Table.Td>{c.full_name}</Table.Td>
                <Table.Td>{c.email}</Table.Td>
                <Table.Td>{c.phone || "—"}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(c)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Customer" centered>
        <CustomerForm onSubmit={createMutation.mutate} submitting={createMutation.isPending} />
      </Modal>
    </>
  );
}