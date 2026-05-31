import client from "./client";

export async function fetchCustomers() {
  const { data } = await client.get("/customers");
  return data;
}

export async function createCustomer(payload) {
  const { data } = await client.post("/customers", payload);
  return data;
}

export async function deleteCustomer(id) {
  await client.delete(`/customers/${id}`);
}