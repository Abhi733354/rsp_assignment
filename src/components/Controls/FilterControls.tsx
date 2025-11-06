// src/components/Controls/FilterControls.tsx
import React from "react";
import { Select } from "@mantine/core";

export interface FilterControlsProps {
  cities: string[];
  fuels: string[];
  years: string[];
  selectedCity: string;
  selectedFuel: string;
  selectedYear: string;
  onCityChange: (val: string) => void;
  onFuelChange: (val: string) => void;
  onYearChange: (val: string) => void;
}


const FilterControls: React.FC<FilterControlsProps> = ({
  cities,
  fuels,
  years,
  selectedCity,
  selectedFuel,
  selectedYear,
  onCityChange,
  onFuelChange,
  onYearChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      <Select
        label="Select Metro City"
        placeholder="Choose a city"
        data={cities}
        value={selectedCity}
        onChange={(val) => onCityChange(val || "")}
      />
      <Select
        label="Select Fuel Type"
        placeholder="Choose a fuel"
        data={fuels}
        value={selectedFuel}
        onChange={(val) => onFuelChange(val || "")}
   
      />
      <Select
        label="Select Year"
        placeholder="Choose a year"
        data={years}
        value={selectedYear}
        onChange={(val) => onYearChange(val || "")}
      
      />
    </div>
  );
};

export default FilterControls;
