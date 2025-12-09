export function parseDate(dateStr: string): Date | null {
  // transform dd/mm/yyyy or dd-mm-yyyy to yyyy-mm-dd
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 1) {
    console.log("Parsing year-only date:", dateStr);
    // year only
    const year = parts[0];
    if (year.length !== 4 || isNaN(Number(year))) {
      return null;
    }
    return new Date(`${year}-01-01`);
  } else if (parts.length === 2) {
    console.log("Parsing month-year date:", dateStr);
    // if month is string like "Jan", "February", convert to month number
    const monthNames: { [key: string]: string } = {
      en: "01", enero: "01",
      feb: "02", febrero: "02",
      mar: "03", marzo: "03",
      abr: "04", abril: "04",
      may: "05", mayo: "05",
      jun: "06", junio: "06",
      jul: "07", julio: "07",
      ago: "08", agosto: "08",
      sep: "09", septiembre: "09",
      oct: "10", octubre: "10",
      nov: "11", noviembre: "11",
      dec: "12", diciembre: "12"
    };
    let month = parts[0].toLowerCase();
    if (isNaN(Number(month))) {
      month = monthNames[month] || "01"; // default to January if unrecognized
    } else {
      month = month.padStart(2, '0');
    }
    const year = parts[1];
    return new Date(`${year}-${month}-01`);
  }else if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
}