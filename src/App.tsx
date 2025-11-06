import React, { useState, useMemo } from "react";
import { useRSPData } from "./hooks/useRSPData";
import type { RSPRow } from "./types";
import FilterControls from "./components/Controls/FilterControls";
import RspChart from "./components/Chart/RspChart";
import { Container, Title, Loader, Center, Text } from "@mantine/core";
//import './styles/main.css'

const App: React.FC = () => {
  // Load CSV data
  const { data, loading } = useRSPData("/data/rsp.csv");

  // Dropdown selections
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Get unique dropdown options
  const cities = useMemo(
    () =>
      Array.from(new Set(data.map((row: RSPRow) => row.City))).filter(
        (c): c is string => Boolean(c)
      ),
    [data]
  );

  const fuels = useMemo(
    () =>
      Array.from(new Set(data.map((row: RSPRow) => row.Fuel))).filter(
        (f): f is string => Boolean(f)
      ),
    [data]
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(data.map((row: RSPRow) => String(row.Year)))
      ).filter((y): y is string => Boolean(y)),
    [data]
  );

  // Filter + compute monthly averages
  const filteredData = useMemo(() => {
    if (!selectedCity || !selectedFuel || !selectedYear) return [];

    const filtered = data.filter(
      (row) =>
        row.City === selectedCity &&
        row.Fuel === selectedFuel &&
        String(row.Year) === selectedYear
    );

    const monthlyAvg: { month: string; value: number }[] = [];

    for (let m = 1; m <= 12; m++) {
      const monthRows = filtered.filter(
        (r) => Number(r.Month) === m
      );

      const avg =
        monthRows.length > 0
          ? monthRows.reduce((sum, r) => sum + (r.RSP || 0), 0) /
            monthRows.length
          : 0;

      monthlyAvg.push({
        month: new Date(2020, m - 1, 1).toLocaleString("default", {
          month: "short",
        }),
        value: Number(avg.toFixed(2)),
      });
    }

    return monthlyAvg;
  }, [data, selectedCity, selectedFuel, selectedYear]);

  // Loading state
  if (loading)
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );

  // UI
  return (
    <Container size="md" py="xl">
      <Title order={2} ta="center" mb="lg">
        Petrol & Diesel RSP Data Visualization
      </Title>

      <FilterControls
        cities={cities}
        fuels={fuels}
        years={years}
        selectedCity={selectedCity}
        selectedFuel={selectedFuel}
        selectedYear={selectedYear}
        onCityChange={setSelectedCity}
        onFuelChange={setSelectedFuel}
        onYearChange={setSelectedYear}
      />

      {selectedCity && selectedFuel && selectedYear ? (
        <RspChart
          city={selectedCity}
          fuel={selectedFuel}
          year={selectedYear}
          data={filteredData}
        />
      ) : (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Text size="sm" c="dimmed">
            Please select all filters to view the chart.
          </Text>
        </div>
      )}
    </Container>
  );
};

export default App;

