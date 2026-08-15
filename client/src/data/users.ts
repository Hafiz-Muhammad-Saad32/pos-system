import type { User } from "@/types";

export interface MockAccount extends User {
  password: string;
}

/** Mock accounts — replaced later by POST /api/auth/login. */
export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "usr-1001",
    name: "Elena Marchetti",
    email: "guest@meridian.com",
    phone: "+1 415 555 0142",
    password: "meridian",
    role: "customer",
    address: {
      address: "412 Larkspur Avenue, Apt 6B",
      city: "San Francisco",
      postalCode: "94109",
    },
  },
  {
    id: "usr-1002",
    name: "Noah Bennett",
    email: "noah@meridian.com",
    phone: "+1 415 555 0199",
    password: "meridian",
    role: "customer",
    address: {
      address: "18 Ashbury Terrace",
      city: "San Francisco",
      postalCode: "94117",
    },
  },
];

export const DEMO_CREDENTIALS = {
  email: "guest@meridian.com",
  password: "meridian",
};
