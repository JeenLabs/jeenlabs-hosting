export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  RATE_LIMITED: 'RATE_LIMITED',
  UPSTREAM_UNAVAILABLE: 'UPSTREAM_UNAVAILABLE',
  INTERNAL: 'INTERNAL',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const StaffRoleName = {
  SUPER_ADMIN: 'super_admin',
  SUPPORT: 'support',
  SALES: 'sales',
  BILLING: 'billing',
  MARKETING: 'marketing',
} as const;

export type StaffRoleName = (typeof StaffRoleName)[keyof typeof StaffRoleName];

export const ActorType = {
  CUSTOMER: 'customer',
  SUB_USER: 'sub_user',
  STAFF: 'staff',
  SYSTEM: 'system',
} as const;

export type ActorType = (typeof ActorType)[keyof typeof ActorType];
