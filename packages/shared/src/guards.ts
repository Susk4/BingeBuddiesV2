export const hasError = <T extends { error: unknown }>(
  value: unknown,
): value is T => {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    (value as T).error !== undefined
  );
};
