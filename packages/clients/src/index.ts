export interface SupabaseClientConfig {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
}

/**
 * Supabase is used for Storage + Realtime only (not auth).
 * Full client wiring lands when Storage/Realtime features are built.
 */
export function createSupabaseAdminConfig(config: SupabaseClientConfig): SupabaseClientConfig {
  if (!config.url || !config.serviceRoleKey) {
    return config;
  }
  return config;
}

export interface ContaboCredentials {
  clientId: string;
  clientSecret: string;
  apiUser: string;
  apiPassword: string;
}
