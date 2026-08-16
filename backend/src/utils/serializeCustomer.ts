import type { ICustomer } from "../models/Customer.js";

// Builds the exact { id, name, email, phone, address, role } shape the
// frontend's User type requires, from a Customer mongoose document.
function serializeCustomerUser(customer: ICustomer) {
  return {
    id: customer._id.toString(),
    name: customer.name,
    email: customer.email || "",
    phone: customer.phone,
    address: {
      address: customer.address || "",
      city: customer.city || "",
      postalCode: customer.postalCode || "",
    },
    role: "customer",
  };
}

export { serializeCustomerUser };
