import { AppShell, Group, Title, NavLink as MantineNavLink, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="md" gap="sm">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>Inventory Manager</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <MantineNavLink
              key={link.to}
              component={NavLink}
              to={link.to}
              label={link.label}
              leftSection={<Icon size={18} />}
              active={location.pathname === link.to}
              onClick={close}
              mb={4}
            />
          );
        })}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}