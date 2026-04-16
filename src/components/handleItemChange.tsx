export handleFilterChange = (
  key: keyof typeof filters,
  value: string,
  allItems: string[]
) => {
  setFilters(prev => {
    const activeItems = prev[key] as string[];

    if (value === 'all') {
      return { ...prev, [key]: allItems };
    }

    if (activeItems.length === allItems.length) {
      return { ...prev, [key]: [value] };
    }

    if (activeItems.includes(value)) {
      return {
        ...prev,
        [key]: activeItems.filter(item => item !== value),
      };
    }

    return {
      ...prev,
      [key]: [...activeItems, value],
    };
  });
};