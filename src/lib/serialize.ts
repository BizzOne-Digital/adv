/**
 * Convert Mongoose documents / lean results into JSON-serializable plain objects
 * suitable for passing from Server Components to Client Components.
 */
export function toPlain<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function idString(value: { _id?: unknown } | null | undefined): string {
  if (!value?._id) return "";
  return String(value._id);
}
