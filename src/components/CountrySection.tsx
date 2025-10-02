import { useState,useEffect } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import MapComponent  from './mapView';
import Flag from "react-world-flags";
import "mapbox-gl/dist/mapbox-gl.css";

const countries = [
  { name: 'Ecuador', count: 22, flag: '🇪🇨', code: 'ECU' },
  { name: 'España', count: 35, flag: '🇪🇸', code: 'ESP' },
  { name: 'Colombia', count: 34, flag: '🇨🇴', code: 'COL' }
];
interface CountrySectionProps {
  activeAuthors: Object[];
  rows: any[];
}
let MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
export function CountrySection({ activeAuthors, rows }: CountrySectionProps) {
  async function countryNameToIso(name) {
    const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(name)}.json?types=country&access_token=${MAPBOX_ACCESS_TOKEN}`);
    const data = await resp.json();
    if (data.features && data.features.length > 0) {
      const feat = data.features[0];
      // sometimes in feat.properties or feat.context you’ll find iso codes
      // or feat.properties.iso_3166_1, etc.
      return feat.properties.short_code.toUpperCase() || null;
    }
    return null;
  }

  useEffect(() => {
    const run = async () => {
    // count countries
    const countryCounts: { name: string; code: string; count: number; percentage?: number }[] = [];
    rows.forEach((row: any) => {
      if (
        activeAuthors.length === 0 ||
        activeAuthors.includes(row.inv_cor) ||
        activeAuthors.some(author => row.inv_nam.split(";").includes(author))
      ) {
        const countries = row.inv_con.split(";").map((c: string) => c.trim());
        countries.forEach((country: string) => {
          const existing = countryCounts.find(c => c.name === country);
          if (existing) {
            existing.count += 1;
          } else {
            countryCounts.push({ name: country, code: '', count: 1 });
          }
        });
      }
    });

    // percentages
    const total = countryCounts.reduce((acc, curr) => acc + curr.count, 0);
    countryCounts.forEach(c => {
      const percentage = c.count / total;
      c.percentage = Math.round(percentage * 1000) / 1000;
    });

    // ISO codes in parallel
    const codes = await Promise.all(
      countryCounts.map(c => countryNameToIso(c.name))
    );

    countryCounts.forEach((c, i) => {
      c.code = codes[i] || '';
    });
    // Join the country counts with same codes
    const mergedCounts: { [key: string]: { name: string; code: string; count: number; percentage?: number } } = {};
    countryCounts.forEach(c => {
      if (c.code) {
        if (mergedCounts[c.code]) {
          mergedCounts[c.code].count += c.count;
        } else {
          mergedCounts[c.code] = { ...c };
        }
      }
    });
    const uniqueCountryCounts = Object.values(mergedCounts);

    // ✅ Now update state after async work is done
    setSelectedCountries(uniqueCountryCounts);
    console.log("Country counts:", uniqueCountryCounts);
  };

  run();
}, [activeAuthors, rows]);

  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<{ name: string; code: string; count: number; percentage?: number }[]>([]);
  useEffect(() => {
  console.log("Selected countries updated:", selectedCountries);
}, [selectedCountries]);
  const toggleCountry = (countryCode: string) => {
    setSelectedCountries(prev => 
      prev.find(c => c.code === countryCode) 
        ? prev.filter(c => c.code !== countryCode)
        : [...prev, { name: countryCode, code: countryCode, count: 0 }]
    );
  };
  const toggleCountryByName = async (countryName: string) => {
    const countryCode = await countryNameToIso(countryName);
    if (!countryCode) return;
    setSelectedCountries(prev => 
      prev.find(c => c.code === countryCode) 
        ? prev.filter(c => c.code !== countryCode)
        : [...prev, { name: countryName, code: countryCode, count: 0 }  ]
    );
  };

  return (
    <div className="sm:flex sm:flex-col sm:h-full lg:grid lg:grid-rows-4 lg:grid-cols-1 lg:h-full xl:grid xl:grid-cols-1 gap-6">
      {/* Map Section */}
      <Card className="lg:row-span-3  p-4">
        <h3 className=" sm:text-xl md:text-xl lg:text-xl font-medium mb-4">Países seleccionados</h3>
        
        {/* Filter buttons */}
        <div className="flex sm:text-xl md:text-xl lg:text-xl gap-2 mb-4">
          <Button variant="selected" size="sm" className=" sm:text-xl md:text-xl lg:text-xl">
            Seleccionado
          </Button>
          <Button variant="ghost" size="sm" className=" sm:text-xl md:text-xl lg:text-xl">
            Inactivo
          </Button>
        </div>

        {/* Simple map representation */}
          {/* Replace with actual map component */}
          <div className="sm:h-128 md:h-128 lg:h-full xl:h-full rounded-md overflow-hidden">
          <MapComponent selectedCountries={selectedCountries} />
          <div style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'white', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>Low</span>
              <div style={{ width: '100px', height: '10px', background: 'linear-gradient(to right, rgb(213, 244, 255), rgb(0, 52, 89))', borderRadius: '5px' }}></div>
              <span style={{ marginLeft: '8px' }}>High</span>
            </div>
          </div>
          </div>
      </Card>

      {/* Country List */}
      <Card className="p-4 lg:overflow-y:auto  lg:row-start-4">
        <h3 className=" sm:text-xl md:text-xl lg:text-xl font-medium mb-4">Países</h3>
        <div className="space-y-3">
          {countries.map((country) => (
            <div 
              key={country.name}
              className={`flex  sm:text-xl md:text-xl lg:text-xl items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedCountries.includes(country.code) ? 'bg-accent/30' : ''
              }`}
              onClick={() => toggleCountry(country.code)}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 rounded bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center">
                  <Flag code={country.code} style={{ width: '2em', height: '2em' }} />
                </div>
                <span className="font-medium">{country.name}</span>
              </div>
              <span className="text-muted-foreground">{country.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}