export function calculatePercentages(countryCounts: {name: string; code: string; count: number; percentage?: number }[]) {
  const total = countryCounts.reduce((acc, curr) => acc + curr.count, 0);
  countryCounts.forEach(c => {
    const percentage = c.count / total;
    c.percentage = Math.round(percentage * 1000) / 1000;
  });
  return countryCounts;
}