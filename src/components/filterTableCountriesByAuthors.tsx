import { countryNameToIso } from "./countryToiso";
import { calculatePercentages } from "./calculatePercentages";

type CountryType = {
    name: string;
    code: string;
    count: number;
    percentage?: number;
};
export async function filterTableCountriesByAuthors(countries: CountryType[], activeAuthors: string[],rows): Promise<CountryType[]> {
    // count countries
    const countryCounts: { name: string; code: string; count: number; percentage?: number }[] = [];
    rows.forEach((row: any) => {
      if (
        activeAuthors.length === 0 ||
        activeAuthors.includes(row.inv_cor) ||
        activeAuthors.some(author => row.inv_nam.split(";").includes(author))
      ) {
        const countries = row.inv_con.split(";").map((c: string) => c.trim());
        countries.forEach((country: string) => {
          const existing = countryCounts.find(c => c.name === country);
          if (existing) {
            existing.count += 1;
          } else {
            countryCounts.push({ name: country, code: '', count: 1 });
          }
        });
      }
    });
    // calculate percentages
    calculatePercentages(countryCounts)

    // ISO codes in parallel
    const codes = await Promise.all(
      countryCounts.map(c => countryNameToIso(c.name))
    );

    countryCounts.forEach((c, i) => {
      c.code = codes[i] || '';
    });
    // Join the country counts with same codes
    const mergedCounts: { [key: string]: { name: string; code: string; count: number; percentage?: number } } = {};
    countryCounts.forEach(c => {
      if (c.code) {
        if (mergedCounts[c.code]) {
          mergedCounts[c.code].count += c.count;
        } else {
          mergedCounts[c.code] = { ...c };
        }
      }
    });
    return Object.values(mergedCounts);
  };
