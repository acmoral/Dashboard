type Row = Record<string, any>;

export const  filterRows = (
  selected: string[],
  rows: Row[],
  field: string,
  isMultiValue: boolean = false
) => {
  if (!selected.length) return rows;

  // Normalize selected values for comparison (lowercase)
  const normalizedSelected = selected.map(s => s.toLowerCase().trim());

  return rows.filter((row) => {
    const raw = (row[field] || '').trim();

    if (!isMultiValue) {
      return normalizedSelected.includes(raw.toLowerCase());
    }

    const values = raw
      .split(';')
      .map((v: string) => v.trim().toLowerCase())
      .filter(Boolean);

    return values.some((v: string) => normalizedSelected.includes(v));
  });
};