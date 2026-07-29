/**
 * Turns anything thrown by Supabase / fetch into a message an administrator
 * can act on. Postgres error text is technical and often leaks schema detail,
 * so the well-known cases are translated explicitly.
 */
export function friendlyError(err: unknown): string {
  const raw =
    err instanceof Error ? err.message : typeof err === "string" ? err : "Something went wrong.";
  const message = raw.toLowerCase();

  if (
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network request failed")
  ) {
    return "Network unavailable — check your connection and try again.";
  }
  if (message.includes("duplicate key") || message.includes("already exists")) {
    return "A record with that name already exists.";
  }
  if (
    message.includes("row-level security") ||
    message.includes("permission denied") ||
    message.includes("not authorised") ||
    message.includes("jwt")
  ) {
    return "You don't have permission to do that. Try signing in again.";
  }
  if (message.includes("violates check constraint")) {
    return "Some values are invalid — check the field lengths and try again.";
  }
  if (message.includes("payload too large") || message.includes("exceeded")) {
    return "That file is too large.";
  }
  return raw;
}
