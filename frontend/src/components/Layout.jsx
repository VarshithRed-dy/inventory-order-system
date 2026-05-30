import { AppShell, Group, Title, Button } from "@mantine/core";
import {
  IconLayoutDashboard,
  IconBox,
  IconUsers,
  IconShoppingCart,
} from "@tabler/icons-react";
import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: IconLayoutDashboard },
  { to: "/products", label: "Products", icon: IconBox },
  { to: "/customers", label: "Customers", icon: IconUsers },
  { to: "/orders", label: "Orders", icon: IconShoppingCart },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <AppShell header={{ height: 64 }} padding="lg">
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Title order={3}>📦 Inventory Manager</Title>
          <Group gap="xs">
            {links.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.to;
              return (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  variant={active ? "filled" : "subtle"}
                  leftSection={<Icon size={18} />}
                  size="sm"
                >
                  {link.label}
                </Button>
              );
            })}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}