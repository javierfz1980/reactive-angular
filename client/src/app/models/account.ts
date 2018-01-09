// TODO: update to typescript 2.4 in order to use string enum for role.
// the original idea was to use RoleType enum as Account.role type, but string enums are available from TS 2.4
export enum RoleType {
  Administrator,
  User
}
export interface Account {
  name: string;
  email: string;
  role: string;
}
