import type { CsvRow } from '../types'
import '../styles/main.css'

export function parseCSV(text: string): CsvRow[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  if (lines.length === 0) return []

  const header = splitLine(lines[0] || '')
  const rows: CsvRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line || line.trim() === '') continue
    const cells = splitLine(line)
    const obj: CsvRow = {}
    for (let j = 0; j < header.length; j++) obj[header[j]] = cells[j] ?? ''
    rows.push(obj)
  }
  return rows
}

function splitLine(line: string): string[] {
  const res: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (ch === ',' && !inQuotes) { res.push(cur); cur = ''; continue }
    cur += ch
  }
  res.push(cur)
  return res.map(s => s.trim())
}
