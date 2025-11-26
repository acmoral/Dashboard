function getADifferentColor(i: number){
    const name = `var(--chart-${i % 20})`;
    return name;
}
export async function filterTableDesign({filteredRows}: {filteredRows: any[]}): Promise<{ name: string; value: number; color: string }[]> {
  
  let i = 1;
  const tipoDesignCounts = filteredRows.reduce((acc, item) => {
    const tipoDesign = item.dis || 'Desconocido';
    if (!acc[tipoDesign]) {
      acc[tipoDesign] = { name: tipoDesign, value: 0, color: getADifferentColor(i)};
      i++;
    }
    acc[tipoDesign].value += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; color: string }>);

  return Object.values(tipoDesignCounts);
}
