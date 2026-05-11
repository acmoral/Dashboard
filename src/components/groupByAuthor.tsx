const groupByAuthor = (rows: Record<string, any>[]) => {
  const map = new Map<string, Record<string, any>>();

  rows.forEach((row) => {
    const author = row.cor_aut;

    if (!map.has(author)) {
      map.set(author, { ...row });
      return;
    }

    const existing = map.get(author)!;

    Object.keys(row).forEach((key) => {
      const currentVal = existing[key];
      const newVal = row[key];

      if (newVal == null) return;

      const normalize = (val: any) =>
        val
          .toString()
          .split(";")
          .map((v: string) => v.trim().toLowerCase()) // normalize
          .filter(Boolean);

      const currentArray = currentVal ? normalize(currentVal) : [];
      const newArray = normalize(newVal);

      const merged = Array.from(new Set([...currentArray, ...newArray]));

      existing[key] = merged.join("; ");
    });
  });

  return Array.from(map.values());
};

export default groupByAuthor;