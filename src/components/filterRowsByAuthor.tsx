

export function filterRowsByAuthor(
  selectedAuthors: string[],
  rows: any[]
): any[] {
  if (selectedAuthors.length === 0) {
    return rows;
  }
  return rows.filter((row: any) => {
    return (
      selectedAuthors.length === 0 ||
      selectedAuthors.includes(row.cor_aut) 
    );
  });
}