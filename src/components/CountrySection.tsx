import { useState,useEffect } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {X} from "lucide-react";
import MapComponent  from './mapView';
import Flag from "react-world-flags";
import "mapbox-gl/dist/mapbox-gl.css";

const countries = [
  { name: 'Ecuador', count: 22, flag: '🇪🇨', code: 'ECU' },
  { name: 'España', count: 35, flag: '🇪🇸', code: 'ESP' },
  { name: 'Colombia', count: 34, flag: '🇨🇴', code: 'COL' }
];
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
  setFilterCountries: (countries: string[] | ((prev: string[]) => string[])) => void;
}
export function CountrySection({ availableCountries, filterCountries, filteredRows, setFilterCountries}: CountrySectionProps) {
  const [counts, setCounts] = useState<CountryType[]>([]);
  return (
    <div className="sm:flex sm:flex-col sm:h-full lg:grid lg:grid-rows-4 lg:grid-cols-1 lg:h-full xl:grid xl:grid-cols-1 gap-6">
      {/* Map Section */}
      <Card className="lg:row-span-3 p-4">
        <h3 className="text-base font-medium mb-4">Países seleccionados</h3>
        
        {/* Filter buttons */}
       {/*  <div className="flex sm:text-xl md:text-xl lg:text-xl gap-2 mb-4"> <Button variant="selected" size="sm" className=" sm:text-xl md:text-xl lg:text-xl"> Seleccionado </Button> <Button variant="ghost" size="sm" className=" sm:text-xl md:text-xl lg:text-xl"> Inactivo </Button> </div> */}

        {/* Simple map representation */}
          {/* Replace with actual map component */}
          <div className="sm:h-128 md:h-128 lg:h-full xl:h-full rounded-md overflow-hidden">
          <MapComponent filterCountries={filterCountries} availableCountries={availableCountries} counts={counts} filteredRows={filteredRows} setFilterCountries={setFilterCountries}  setCounts={setCounts}/>
          </div>
      </Card>

      {/* Country List */}
      <Card className="p-4 overflow-y-auto lg:row-start-4">
        <h3 className="text-base font-medium mb-4">Países</h3>
        <div className="space-y-3">
          {filterCountries.length > 0 && (
            <div className="text-sm text-muted-foreground">{counts.length} países seleccionados  <Button variant="outline" size="sm" onClick={() => setFilterCountries([])}>remover filtro <X className="ml-1" /></Button></div>
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
                <div className="w-6 h-4 rounded bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center">
                  <Flag code={country.code} style={{ width: '2em', height: '2em' }} />
                </div>
                <span className="text-sm font-medium">{country.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{country.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}