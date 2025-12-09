import { countryNameToIso } from "./countryToiso";
import { parseDate } from "./parseDates";
export async function filterRowsByDate(
  activeDates: { startDate: string; endDate: string },
  rows: any[]
): Promise<any[]> {
  const { startDate, endDate } = activeDates;

  // If no dates are set, return all rows
  if( startDate === null && endDate === null) {
    return rows;
  }
  if (!startDate && !endDate) {
    return rows;
  }

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  return rows.filter((row: any) => {
    const rowRanges = row.db_tim.split(";").map((rangeStr: string) => rangeStr.trim());
    const rowsDates = rowRanges.flatMap((range: string) => {
      const parts = range.split(/[-–]/).map((s: string) => s.trim());
      // conserve invalid dates as null
      const dates = parts.map((part: string) => parseDate(part));
      return dates;
    });
    if (rowsDates.length === 1){
      return true; // keep rows with no dates
    }
    for (const date of rowsDates) {
      if  (date === null) true; // keep invalid dates as null
      if (
        (start && end && date >= start && date <= end) ||
        (start && !end && date >= start) ||
        (!start && end && date <= end)
      ) {
        return true;
      }
    }
    return false;
  });
}