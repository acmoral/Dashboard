import { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import MapComponent from './mapView';
import Flag from "react-world-flags";
import "mapbox-gl/dist/mapbox-gl.css";
import { columnConfig } from "./configTable";

type ColumnConfig = typeof columnConfig;

type FilterableKeys = {
  [K in keyof ColumnConfig]: ColumnConfig[K]["filter"] extends true ? K : never
}[keyof ColumnConfig];

type CountryType = {
  name: string;
  code: string;
  count: number;
  percentage?: number;
};

interface CountrySectionProps {
  availableCountries: string[];
  filterCountries: string[];
  filteredRows: any[];
  setFilterCountries: (
    key: FilterableKeys,
    value: string,
    allItems: string[]
  ) => void;
}

export function CountrySection({
  availableCountries,
  filterCountries,
  filteredRows,
  setFilterCountries
}: CountrySectionProps) {

  const [counts, setCounts] = useState<CountryType[]>([]);

  const toggleCountry = (code: string) => {
    setFilterCountries('con', code, availableCountries);
  };

  return (
    <div className="h-full grid grid-cols-1 gap-6 lg:grid-cols-4">

      {/* Map Section */}
      <Card className="lg:col-span-3 p-4 flex flex-col">
        <h3 className="text-base font-medium mb-4">Países seleccionados</h3>

        <div className="flex-1 rounded-md overflow-hidden">
          <MapComponent
            filterCountries={filterCountries}
            availableCountries={availableCountries}
            counts={counts}
            filteredRows={filteredRows}
            setFilterCountries={setFilterCountries}
            setCounts={setCounts}
          />
        </div>
      </Card>

      {/* Country List */}
      <Card className="p-4 overflow-y-auto flex flex-col">
        <h3 className="text-base font-medium mb-4">Países</h3>

        <div className="space-y-3 flex-1 overflow-y-auto">

          {filterCountries.length > 0 && (
            <div className="text-sm text-muted-foreground flex items-center justify-between">
              <span>{filterCountries.length} países seleccionados</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>{
                  console.log('removed filter')
                  setFilterCountries('con', 'all', availableCountries)
                }
                }
              >
                remover filtro <X className="ml-1" />
              </Button>
            </div>
          )}

          {counts.map((country) => (
            <div
              key={country.code}
              className={`flex text-sm items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                filterCountries.includes(country.code) ? 'bg-accent/30' : ''
              }`}
              onClick={() => toggleCountry(country.code)}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 flex items-center justify-center">
                  <Flag code={country.code} style={{ width: '2em', height: '2em' }} />
                </div>
                <span className="text-sm font-medium">{country.name}</span>
              </div>

              <span className="text-sm text-muted-foreground">
                {country.count}
              </span>
            </div>
          ))}

        </div>
      </Card>
    </div>
  );
}