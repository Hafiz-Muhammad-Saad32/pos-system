// Builds the exact { id, name, email, phone, address, role } shape the
// frontend's User type requires, from a Customer mongoose document.
function serializeCustomerUser(customer) {
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

module.exports = { serializeCustomerUser };
