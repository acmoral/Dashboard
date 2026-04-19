type AggregateOptions<T> = {
  rows: T[];
  getValue: (item: T) => string | undefined;
  split?: boolean;
  separator?: string;
};

function getADifferentColor(i: number) {
  return `var(--chart-${i % 20})`;
}

export function aggregateCounts<T>({
  rows,
  getValue,
  split = false,
  separator = ";",
}: AggregateOptions<T>): { name: string; value: number; color: string }[] {
  let i = 1;

  const counts = rows.reduce((acc, item) => {
    const rawValue = getValue(item);
    
    // Skip items with no value instead of defaulting to "not reported"
    if (!rawValue || rawValue.trim() === '') {
      return acc;
    }

    const values = split
      ? rawValue.split(separator).map(v => v.trim()).filter(v => v !== '')
      : [rawValue];

    for (const value of values) {
      if (value && !acc[value]) {
        acc[value] = {
          name: value,
          value: 0,
          color: getADifferentColor(i),
        };
        i++;
      }
      if (value) {
        acc[value].value += 1;
      }
    }

    return acc;
  }, {} as Record<string, { name: string; value: number; color: string }>);

  return Object.values(counts);
}