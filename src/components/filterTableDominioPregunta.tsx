function getADifferentColor(i: number){
    const name = `var(--chart-${i % 20})`;
    return name;
}
export async function filterTableTipoDom({filteredRows}: {filteredRows: any[]}): Promise<{ name: string; value: number; color: string }[]> {
  
  let i = 1;
  const tipoDominioCounts = filteredRows.reduce((acc, item) => {
    const tipoDominio = item.dom || 'Desconocido';
    if (!acc[tipoDominio]) {
      acc[tipoDominio] = { name: tipoDominio, value: 0, color: getADifferentColor(i)};
      i++;
    }
    acc[tipoDominio].value += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; color: string }>);

  return Object.values(tipoDominioCounts);
}
