import { useEffect, useState } from "react";
import { parseCSV } from "../utils/csvParser";
import type { CsvRow, RSPRow } from "../types";
import '../styles/main.css'

function toNumber(v: string | undefined): number {
  if (v === undefined) return 0;
  const s = v.trim();
  if (s === "") return 0;
  const n = Number(s);
  return Number.isNaN(n) ? 0 : n;
}

function pickKey(allKeys: string[], candidates: string[]) {
  return candidates.find((c) => allKeys.includes(c)) || allKeys[0] || "";
}

export function useRSPData(csvPath = "/data/rsp.csv") {
  const [data, setData] = useState<RSPRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(csvPath);
        if (!res.ok) throw new Error(`Failed to fetch ${csvPath}: ${res.status}`);
        const text = await res.text();
        const parsed = parseCSV(text); // CsvRow[]

        if (cancelled) return;

        if (parsed.length === 0) {
          setData([]);
          return;
        }

        const keys = Object.keys(parsed[0]);

        const cityCandidates = ["City", "city", "Metro City", "metro_city", "City Name", "City_Name"];
        const fuelCandidates = ["Fuel", "fuel", "Fuel Type", "fuel_type"];
        const yearCandidates = ["Year", "year", "Calendar Year", "calendar_year"];
        const monthCandidates = ["Month", "month", "MM", "Month Number", "MonthName"];
        const priceCandidates = ["RSP", "rsp", "Price", "Selling Price", "RSP Value", "Value", "Value(Rs)"];

        const cityKey = pickKey(keys, cityCandidates);
        const fuelKey = pickKey(keys, fuelCandidates);
        const yearKey = pickKey(keys, yearCandidates);
        const monthKey = pickKey(keys, monthCandidates);
        const priceKey = pickKey(keys, priceCandidates);

        const rows: RSPRow[] = parsed.map((r: CsvRow) => {
          const cityRaw = (r[cityKey] ?? "").toString().trim();
          const fuelRaw = (r[fuelKey] ?? "").toString().trim();
          const yearRaw = (r[yearKey] ?? "").toString().trim();
          const monthRaw = (r[monthKey] ?? "").toString().trim();
          const priceRaw = (r[priceKey] ?? "").toString().trim();

          // month conversion: try numeric, else try short name
          let monthNum = toNumber(monthRaw);
          if (monthNum === 0 && monthRaw) {
            const mm = monthRaw.toLowerCase();
            const short = mm.slice(0, 3);
            const map: Record<string, number> = {
              jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12
            };
            monthNum = map[short] ?? 0;
          }

          return {
            City: cityRaw || "Unknown",
            Fuel: fuelRaw || "Unknown",
            Year: toNumber(yearRaw),
            Month: monthNum,
            RSP: toNumber(priceRaw)
          };
        });

        setData(rows);
      } catch (err: any) {
        setError(String(err?.message ?? err));
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [csvPath]);

  return { data, loading, error };
}



