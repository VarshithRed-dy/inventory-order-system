import { TextInput, Button, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function CustomerForm({ onSubmit, submitting }) {
  const form = useForm({
    initialValues: { full_name: "", email: "", phone: "" },
    validate: {
      full_name: (v) => (v.trim().length > 0 ? null : "Name is required"),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Enter a valid email"),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput label="Full name" placeholder="Asha Rao" {...form.getInputProps("full_name")} />
        <TextInput label="Email" placeholder="asha@example.com" {...form.getInputProps("email")} />
        <TextInput label="Phone" placeholder="555-0100" {...form.getInputProps("phone")} />
        <Group justify="flex-end" mt="sm">
          <Button type="submit" loading={submitting}>Save</Button>
        </Group>
      </Stack>
    </form>
  );
}