function getADifferentColor(i: number){
    const name = `var(--chart-${i % 20})`;
    return name;
}
export async function filterTableTipoAtencion({filteredRows}: {filteredRows: any[]}): Promise<{ name: string; value: number; color: string }[]> {

  let i = 1;
  const tipoAtencionCounts = filteredRows.reduce((acc, item) => {
    const tipoAtencion = item.set || 'Desconocido';
    if (!acc[tipoAtencion]) {
      acc[tipoAtencion] = { name: tipoAtencion, value: 0, color: getADifferentColor(i)};
      i++;  
    }
    acc[tipoAtencion].value += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; color: string }>);

  return Object.values(tipoAtencionCounts);
}
