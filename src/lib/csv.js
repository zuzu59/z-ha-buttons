function escapeCell(value) {
  const text = String(value ?? '');
  if (/[",\n\r;]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function toCsv(rows) {
  const header = ['table', 'json'].map(escapeCell).join(',');
  const lines = rows.map((row) => [row.table, JSON.stringify(row.data)].map(escapeCell).join(','));
  return [header, ...lines].join('\n');
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
      continue;
    }
    if (char === ',') {
      cells.push(current);
      current = '';
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
}

export function fromCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const [header, ...body] = lines;
  if (!header || !header.includes('table') || !header.includes('json')) {
    throw new Error('CSV invalide');
  }
  return body.map((line) => {
    const [table, json] = splitCsvLine(line);
    return { table, data: JSON.parse(json) };
  });
}
