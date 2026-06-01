const normalizeValues = (value) =>
  value
    .toString()
    .split(/[,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const dedupeValues = (values) => {
  const seen = new Map();

  values.forEach((item) => {
    const lower = item.toLowerCase();
    if (!seen.has(lower)) {
      seen.set(lower, item);
    }
  });

  return Array.from(seen.values());
};

const groupByRowDatabases = (rows) => {
  const groups = new Map();

  rows.forEach((row) => {
    const key = `${row.ti}||${row.ref}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  });

  const result = [];

  groups.forEach((groupRows) => {
    const collectJoined = (k) =>
      groupRows
        .map((r) => (r[k] == null ? "" : r[k]))
        .filter(Boolean)
        .join("; ");

    const dsJoined = collectJoined("ds_en");
    const dsValues = dedupeValues(normalizeValues(dsJoined));
    const N = Math.max(1, dsValues.length);

    const perRowDs = groupRows.map((r) =>
      r.ds_en == null || r.ds_en === "" ? [] : dedupeValues(normalizeValues(r.ds_en))
    );

    const sourceIndexByDs = dsValues.map((val) => {
      const lower = val.toLowerCase();
      const idx = perRowDs.findIndex((arr) => arr.some((v) => v.toLowerCase() === lower));
      return idx >= 0 ? idx : 0;
    });

    const cols = Array.from(new Set(groupRows.flatMap((r) => Object.keys(r))));

    for (let idx = 0; idx < N; idx++) {
      const i = idx;
      const sourceRowIndex = sourceIndexByDs[idx] ?? 0;
      const newRow = {};

      cols.forEach((k) => {
        if (k === "ti" || k === "ref") {
          newRow[k] = groupRows[0][k];
          return;
        }

        const joined = collectJoined(k);
        const vals = joined ? dedupeValues(normalizeValues(joined)) : [];

        const perRowVals = groupRows.map((r) =>
          r[k] == null || r[k] === "" ? [] : dedupeValues(normalizeValues(r[k]))
        );

        const sourceVals = perRowVals[sourceRowIndex] || [];
        const desiredDs = dsValues[idx];
        const matchInSource = sourceVals.find((v) => v.toLowerCase() === (desiredDs || "").toLowerCase());
        if (matchInSource) {
          newRow[k] = matchInSource;
          return;
        }

        if (sourceVals.length === N && sourceVals[i] != null) {
          newRow[k] = sourceVals[i];
          return;
        }

        const rowWithExactN = perRowVals.find((arr) => arr.length === N && arr[i] != null);
        if (rowWithExactN) {
          newRow[k] = rowWithExactN[i];
          return;
        }

        const rowWithIth = perRowVals.find((arr) => arr.length > 1 && arr[i] != null);
        if (rowWithIth) {
          newRow[k] = rowWithIth[i];
          return;
        }

        if (vals.length === N) {
          newRow[k] = vals[i] ?? "";
        } else if (vals.length === 1) {
          newRow[k] = vals[0];
        } else if (vals.length === 0) {
          newRow[k] = groupRows[0][k] ?? "";
        } else {
          newRow[k] = vals[i] ?? vals[0] ?? (groupRows[0][k] ?? "");
        }
      });

      result.push(newRow);
    }
  });

  return result;
};

const rows = [
  { ti: 'T', ref: 'R', ds_en: 'A; B', ds_ty: 'X;Y', col1: 'p' },
  { ti: 'T', ref: 'R', ds_en: 'C', ds_ty: 'Z', col1: 'q' },
  { ti: 'T', ref: 'R', ds_en: 'D;E;F', ds_ty: '', col1: 'r' },
];

console.log(JSON.stringify(groupByRowDatabases(rows), null, 2));
