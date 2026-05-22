import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import MapComponent from './mapView';
import Flag from "react-world-flags";
import "mapbox-gl/dist/mapbox-gl.css";
import { columnConfig } from "./configTable";
import { isoToCountryName } from "./countryToiso";
import { AuthorsTable } from "./AuthorsTable";

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
  visibleState: string;
  setVisibleState: (state: string) => void;
  mapFilters: {
    con?: {
      active: string[];
      available: string[];
      onChange: (value: string) => void;
    };
    ds_con?: {
      active: string[];
      available: string[];
      onChange: (value: string) => void;
    };
  };
  tableFilters: {
    [K in FilterableKeys]?: {
      active: string[];
      available: string[];
      onChange: (value: string) => void;
    };
  };
  filteredRows: any[];
  countryCounts: {
    con: CountryType[];
    ds_con: CountryType[];
  };
  mapCounts: {
    con: CountryType[];
    ds_con: CountryType[];
  };
}

export function DashboardSection({
  visibleState,
  setVisibleState,
  mapFilters,
  tableFilters,
  filteredRows,
  countryCounts,
  mapCounts,
}: CountrySectionProps) {

  const toggleCountry = (code: string, filterKey: 'con' | 'ds_con') => {
    if (mapFilters[filterKey]) {
      mapFilters[filterKey].onChange(code);
    }
  };

  const renderFilterCard = (filterKey: 'con' | 'ds_con', label: string) => {
    const filter = mapFilters[filterKey];
    if (!filter) return null;

    const counts = countryCounts[filterKey];
    const totalCount = counts.reduce((sum, country) => sum + country.count, 0);
    
    // Display countries from counts, convert ISO codes to country names
    const displayCountries = counts.map(country => ({
      name: isoToCountryName(country.code) || country.code,
      code: country.code,
      count: country.count,
      percentage: totalCount ? country.count / totalCount : 0,
    }));

    return (
      <Card key={filterKey} className="p-4 overflow-y-auto flex flex-col">
        <h3 className="text-base font-medium mb-4">{label}</h3>

        <div className="space-y-3 flex-1 overflow-y-auto">

          {filter.active.length > 0 && (
            <div className="text-sm text-muted-foreground flex items-center justify-between">
              <span>{filter.active.length} seleccionados</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>{
                  console.log('removed filter')
                  filter.onChange('all');
                }
                }
              >
                remover filtro <X className="ml-1" />
              </Button>
            </div>
          )}

          {displayCountries.map((country) => (
            <div
              key={country.code}
              className={`flex text-sm items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                filter.active.includes(country.code) ? 'bg-accent/30' : ''
              }`}
              onClick={() => toggleCountry(country.code, filterKey)}
            >
              <div className="flex items-center gap-3">
                {country.code !== 'MULTINACIONAL' && (
                  <div className="w-6 h-4 flex items-center justify-center">
                    <Flag code={country.code} style={{ width: '2em', height: '2em' }} />
                  </div>
                )}
                <span className="text-sm font-medium">{country.name}</span>
              </div>

              <div className="flex flex-col gap-2 w-full items-end">
                <div className="h-2 w-20  bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-secondary justify-self-end rounded-full"
                    style={{
                      width: `${(country.percentage ?? 0) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-xs text-muted-foreground">
                  {Math.round((country.percentage ?? 0) * 100)}%
                </span>
              </div>
            </div>
          ))}

        </div>
      </Card>
    );
  };

  return (
    <div className="h-full grid grid-cols-1 gap-6 lg:grid-cols-4">

      {/* Map Section */}

        <div className="lg:col-span-3 rounded-md overflow-hidden">
          <AuthorsTable visibleState={visibleState} setVisibleState={setVisibleState} filteredRows={filteredRows} filters={tableFilters} />
        </div>

      {/* Filter Cards Container */}
      <div className="flex flex-col gap-6">
        {renderFilterCard('con', columnConfig.con.label)}
        {renderFilterCard('ds_con', columnConfig.ds_con.label)}
      </div>
    </div>
  );
}