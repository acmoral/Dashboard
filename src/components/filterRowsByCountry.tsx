import { countryNameToIso } from "./countryToiso";


export async function filterRowsByCountry(
  filterCountries: string[],
  rows: any[]
): Promise<any[]> {
  // Map rows to boolean checks asynchronously, then filter by those results
  if (filterCountries.length === 0) {
    return rows;
  }
  const checks = await Promise.all(
    rows.map(async (row: any) => {
      const rowCountries = row.inv_con.split(";").map((c: string) => c.trim());
      const rowCountryIsos = await Promise.all(
        rowCountries.map((country: string) => countryNameToIso(country))
      );
      return rowCountryIsos.some((iso: string | null) => iso && filterCountries.includes(iso));
    })
  );

  return rows.filter((_, idx) => checks[idx]);
}