export async function fetchDatabase() {
  const url = import.meta.env.VITE_GOOGLE_SHEET_URL;
  const res = await fetch(url);
  const csvText = await res.text();
  const lines = csvText.split("\n");
  const headers = lines[0].split(",");
  const data = lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {} as Record<string, string>);
  });
  
  return data;
}