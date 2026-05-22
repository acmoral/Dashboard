const normalizeValues = (value: any) =>
  value
    .toString()
    .split(/[,;]+/)
    .map((item: string) => item.trim())
    .filter(Boolean);

const dedupeValues = (values: string[]) => {
  const seen = new Map<string, string>();

  values.forEach((item) => {
    const lower = item.toLowerCase();
    if (!seen.has(lower)) {
      seen.set(lower, item);
    }
  });

  return Array.from(seen.values());
};

const normalizeAndDedupe = (value: any) =>
  dedupeValues(normalizeValues(value)).join("; ");

const mergeValues = (existingValue: any, rowValue: any) => {
  if (rowValue == null || rowValue === "") {
    return existingValue;
  }

  if (existingValue == null || existingValue === "") {
    return normalizeAndDedupe(rowValue);
  }

  return normalizeAndDedupe(`${existingValue}; ${rowValue}`);
};

const groupByRowDatabases = (rows: Record<string, any>[]) => {
  const map = new Map<string, Record<string, any>>();

  rows.forEach((row) => {
    const key = `${row.ti}||${row.ref}`;

    if (!map.has(key)) {
      const normalizedRow = Object.keys(row).reduce((acc, k) => {
        acc[k] = row[k] == null || row[k] === "" ? row[k] : normalizeAndDedupe(row[k]);
        return acc;
      }, { ...row } as Record<string, any>);

      map.set(key, normalizedRow);
      return;
    }

    const existing = map.get(key)!;

    Object.keys(row).forEach((k) => {
      existing[k] = mergeValues(existing[k], row[k]);
    });
  });

  return Array.from(map.values());
};

export default groupByRowDatabases;