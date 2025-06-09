export const ROLE_ADMIN = 1;
export const ROLE_MEMBER = 2;

export const isRoleAdmin = (roleId: number) => roleId === ROLE_ADMIN;
export const isRoleMember = (roleId: number) => roleId === ROLE_MEMBER;
