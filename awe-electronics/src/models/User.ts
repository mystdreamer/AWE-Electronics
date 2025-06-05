// src/models/User.ts
export type UserRole = "customer" | "employee";

export class User {
  id: string;
  name: string;
  role: UserRole;

  constructor(id: string, name: string, role: UserRole) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  isCustomer(): boolean {
    return this.role === "customer";
  }

  isEmployee(): boolean {
    return this.role === "employee";
  }
}
