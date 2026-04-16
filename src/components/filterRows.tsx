type Row = Record<string, any>;

export const  filterRows = (
  selected: string[],
  rows: Row[],
  field: string,
  isMultiValue: boolean = false
) => {
  if (!selected.length) return rows;

  return rows.filter((row) => {
    const raw = (row[field] || '').trim();

    if (!isMultiValue) {
      return selected.includes(raw);
    }

    const values = raw
      .split(';')
      .map((v: string) => v.trim())
      .filter(Boolean);

    return values.some((v: string) => selected.includes(v));
  });
};