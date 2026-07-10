export function getConfiguredApiKeys(): string[] {
  return [process.env.API_KEY_1, process.env.API_KEY_2].filter(
    (key): key is string => Boolean(key),
  );
}

export function isValidApiKey(request: {
  headers: Record<string, string | string[] | undefined>;
}): boolean {
  const header = request.headers['api-key'];
  if (!header || Array.isArray(header)) {
    return false;
  }

  const keys = getConfiguredApiKeys();
  return keys.length > 0 && keys.includes(header);
}
