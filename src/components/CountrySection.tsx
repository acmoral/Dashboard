import { useState,useEffect } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import MapComponent  from './mapView';
import Flag from "react-world-flags";
import "mapbox-gl/dist/mapbox-gl.css";
import { calculatePercentages } from './calculatePercentages';
import { countryNameToIso } from './countryToiso';
import { filterTableCountriesByAuthors } from './filterTableCountriesByAuthors';
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
  activeAuthors: Object[];
  rows: any[];
  availableCountries: CountryType[];
  selectedCountries: CountryType[];
  setSelectedCountries: (countries: CountryType[] | ((prev: CountryType[]) => CountryType[])) => void;
}
export function CountrySection({ activeAuthors, rows, availableCountries, selectedCountries, setSelectedCountries}: CountrySectionProps) {
  useEffect(() => {
    console.log("active authors changed");
  }, [activeAuthors]);
  useEffect(() => {
    console.log("rows changed");
  }, [rows]);
  useEffect(() => {
  console.log("Available countries updated:", availableCountries);
}, [availableCountries]);
  const toggleCountry = (code: string) => {
    console.log("Toggling country:", code);
  };
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
          <MapComponent selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} availableCountries={availableCountries} />
          <div style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'white', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>Low</span>
              <div style={{ width: '100px', height: '10px', background: 'linear-gradient(to right, rgb(213, 244, 255), rgb(0, 52, 89))', borderRadius: '5px' }}></div>
              <span style={{ marginLeft: '8px' }}>High</span>
            </div> */}
          </div>
          </div>
      </Card>

      {/* Country List */}
      <Card className="p-4 overflow-y-auto lg:row-start-4">
        <h3 className="text-base font-medium mb-4">Países</h3>
        <div className="space-y-3">
          {countries.map((country) => (
            <div 
              key={country.name}
              className={`flex text-sm items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedCountries.includes(country.code) ? 'bg-accent/30' : ''
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