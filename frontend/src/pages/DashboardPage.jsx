import {
  Title, SimpleGrid, Paper, Text, Group, Table, Badge,
  Skeleton, Stack, ThemeIcon,
} from "@mantine/core";
import { IconBox, IconUsers, IconShoppingCart, IconAlertTriangle } from "@tabler/icons-react";
import { BarChart } from "@mantine/charts";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";
import { fetchCustomers } from "../api/customers";
import { fetchOrders } from "../api/orders";

const LOW_STOCK_THRESHOLD = 10;

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Paper withBorder p="lg" radius="md">
      <Group>
        <ThemeIcon size={44} radius="md" variant="light" color={color}>
          <Icon size={24} />
        </ThemeIcon>
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{label}</Text>
          <Text size="xl" fw={700}>{value}</Text>
        </div>
      </Group>
    </Paper>
  );
}

export default function DashboardPage() {
  const { data: products = [], isLoading: pl } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: customers = [], isLoading: cl } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: orders = [], isLoading: ol } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });

  const loading = pl || cl || ol;
  const lowStock = products.filter((p) => p.quantity < LOW_STOCK_THRESHOLD);
  const recentOrders = orders.slice(0, 5);

  // Group orders by day for the chart.
  const ordersByDay = {};
  orders.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString(undefined, {
      month: "short", day: "numeric",
    });
    ordersByDay[day] = (ordersByDay[day] || 0) + 1;
  });
  const chartData = Object.entries(ordersByDay).map(([date, count]) => ({ date, orders: count }));

  if (loading) {
    return (
      <Stack>
        <Title order={2}>Dashboard</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {[...Array(4)].map((_, i) => <Skeleton key={i} height={92} radius="md" />)}
        </SimpleGrid>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Title order={2}>Dashboard</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard icon={IconBox} label="Products" value={products.length} color="teal" />
        <StatCard icon={IconUsers} label="Customers" value={customers.length} color="blue" />
        <StatCard icon={IconShoppingCart} label="Orders" value={orders.length} color="grape" />
        <StatCard icon={IconAlertTriangle} label="Low stock" value={lowStock.length} color="red" />
      </SimpleGrid>

      {chartData.length > 0 && (
        <Paper withBorder p="lg" radius="md">
          <Text fw={600} mb="md">Orders over time</Text>
          <div style={{ width: "100%", minWidth: 0 }}>
            <BarChart
              h={240}
              data={chartData}
              dataKey="date"
              series={[{ name: "orders", color: "teal.6" }]}
            />
          </div>
        </Paper>
      )}

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Paper withBorder p="lg" radius="md">
          <Text fw={600} mb="md">Recent orders</Text>
          {recentOrders.length === 0 ? (
            <Text c="dimmed" size="sm">No orders yet.</Text>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Order</Table.Th>
                  <Table.Th>Items</Table.Th>
                  <Table.Th>Total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentOrders.map((o) => (
                  <Table.Tr key={o.id}>
                    <Table.Td>#{o.id}</Table.Td>
                    <Table.Td>{o.items.length}</Table.Td>
                    <Table.Td>${Number(o.total_amount).toFixed(2)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Text fw={600} mb="md">Low stock alerts</Text>
          {lowStock.length === 0 ? (
            <Text c="dimmed" size="sm">All products well stocked. 🎉</Text>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>SKU</Table.Th>
                  <Table.Th>Stock</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {lowStock.map((p) => (
                  <Table.Tr key={p.id}>
                    <Table.Td>{p.name}</Table.Td>
                    <Table.Td>{p.sku}</Table.Td>
                    <Table.Td><Badge color="red" variant="light">{p.quantity}</Badge></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}