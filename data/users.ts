import type { User } from "@/lib/types";

export const teamMembers: User[] = [
  { id: "u_01", name: "Ada Lin", email: "ada@adstack.io", role: "admin" },
  { id: "u_02", name: "Marco Reyes", email: "marco@adstack.io", role: "trader" },
  { id: "u_03", name: "Priya Shah", email: "priya@adstack.io", role: "ops" },
  { id: "u_04", name: "Sam Okafor", email: "sam@adstack.io", role: "ops" },
  { id: "u_05", name: "Jules Park", email: "jules@adstack.io", role: "viewer" },
];

export const currentUser: User = {
  id: "u_self",
  name: "Ali Madjaji",
  email: "demo@adstack.io",
  role: "admin",
  avatar: "/ali.png",
};
