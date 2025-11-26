function getADifferentColor(i: number){
    const name = `var(--chart-${i % 20})`;
    return name;
}
export async function filterTableTipoDisease({filteredRows}: {filteredRows: any[]}): Promise<{ name: string; value: number; color: string }[]> {

  let i = 1;
  const tipoDiseaseCounts = filteredRows.reduce((acc, item) => {
    const tipoDisease = item.dise || 'Desconocido';
    const SpreadtipoDisease = tipoDisease.split(";").map((t: string) => t.trim());
    for (const tipo of SpreadtipoDisease) {
      if (!acc[tipo]) {
        acc[tipo] = { name: tipo, value: 0, color: getADifferentColor(i)};
        i++;
      }
      acc[tipo].value += 1;
    }
    return acc;
  }, {} as Record<string, { name: string; value: number; color: string }>);

  return Object.values(tipoDiseaseCounts);
}

