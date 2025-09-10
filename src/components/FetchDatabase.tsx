export async function fetchDatabase() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTCXklDWTEuDLGjn0xBdpbXMgJhjXFusekGHXz3MAO-_rTGH0kbLi-ejDKp1reIYZBO3BhNUYiXq8nn/pub?output=csv");
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