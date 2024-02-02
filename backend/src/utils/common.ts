export function safeJsonParse(value: any) {
  if (typeof value === 'string' && isJSON(value)) {
    return JSON.parse(value);
  }

  return value;
}

export function isJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}