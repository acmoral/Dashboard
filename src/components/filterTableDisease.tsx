function getADifferentColor(i: number){
    const name = `var(--chart-${i % 20})`;
    return name;
}
export async function filterTableTipoDisease(rows: [], activeAuthors: string[], activeCountries: string[]): Promise<{ name: string; value: number; color: string }[]> {
  const filteredData = rows.filter(item => {
    const isAuthorActive = activeAuthors.length === 0 || activeAuthors.includes(item.inv_cor) || activeAuthors.some(author => item.inv_nam.split(";").includes(author));
    const isCountryActive = activeCountries.length === 0 || activeCountries.some(c => item.inv_con.split(";").includes(c));
    return isAuthorActive && isCountryActive;
  });
  let i = 1;
  const tipoDiseaseCounts = filteredData.reduce((acc, item) => {
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

