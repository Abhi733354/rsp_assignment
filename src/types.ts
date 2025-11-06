export type CsvRow = Record<string, string>

export interface MonthAggregate {
  sums: number[] 
  counts: number[] 
}

export interface RSPRow {
  City: string;
  Fuel: string;
  Year: number;
  Month: number;
  RSP: number;
}

export type DataIndex = Map<string, Map<string, Map<string, MonthAggregate>>>
