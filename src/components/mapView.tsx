import { useEffect, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { blueScale } from "./blueScale";
import { countryNameToIso } from "./countryToiso";
import { calculatePercentages } from "./calculatePercentages";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

type CountryType = {
  name: string;
  code: string;
  count: number;
  percentage?: number;
};

export default function MapComponent({
  selectedCountries, setSelectedCountries, availableCountries
}: {
  selectedCountries: CountryType[];
  setSelectedCountries: (countries: CountryType[] | ((prev: CountryType[]) => CountryType[])) => void;
  availableCountries: CountryType[];
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const availableRef = useRef(availableCountries);
  const selectedRef = useRef(selectedCountries);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const hoveredRef = useRef(hoveredCountry);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  useEffect(() => {
    selectedRef.current = selectedCountries;
    popupRef.current?.remove();
    setHoveredCountry(null);
  }, [selectedCountries]);
  useEffect(() => {
    hoveredRef.current = hoveredCountry;
  }, [hoveredCountry]);
  useEffect(() => {
    availableRef.current = availableCountries;
  }, [availableCountries]);
  
  // Initialize map only once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [0, 20],
      projection: "mercator",
      zoom: 2,
    });

    map.addControl(new mapboxgl.NavigationControl());
    
    map.on("load", () => {
      map.addSource("countries", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });

      const WORLDVIEW = "US";
      const worldview_filter = [
        "all",
        ["==", ["get", "disputed"], "false"],
        [
          "any",
          ["==", "all", ["get", "worldview"]],
          ["in", WORLDVIEW, ["get", "worldview"]],
        ],
      ];

      map.addLayer({
        id: "countries-per-blue",
        type: "fill",
        source: "countries",
        "source-layer": "country_boundaries",
        paint: {
          "fill-color": "transparent", // default
          "fill-opacity": 0.8,
        },
        filter: worldview_filter,
      });

      // Optional: click handler
      map.on("click", "countries-per-blue", async (e) => {
        const country = e.features?.[0]?.properties?.name;
        const countries = availableRef.current;
        if (!country) return;

        const isoCode = await countryNameToIso(country);
        if (!isoCode) return;
        setSelectedCountries(prev => {
          const existing = prev.find(c => c.code === isoCode);
          // Case 1: All selected → reset to only clicked one
          if (prev.length === countries.length) {
            return calculatePercentages(countries.filter(c => c.code === isoCode));
          }

          // Case 2: If already selected → remove it
          if (existing) {
            if (prev.length === 1) {
              return calculatePercentages(countries);
            }
            return calculatePercentages(prev.filter(c => c.code !== isoCode));
          }

          // Case 3: Otherwise → add it
          const found = countries.find(c => c.code === isoCode);
          if (found) {
            return calculatePercentages([...prev, found]);
          }
          return prev;
        });
      });
      
      map.on("mousemove", "countries-per-blue", (e) => {
        if (!e.features || !e.features.length) return;
        const country = e.features[0];
        if (!country) return;

        if (hoveredRef.current === country.properties?.name) return;
        // Create a popup
        setHoveredCountry(country.properties?.name || null);
        map.getCanvas().style.cursor = "pointer";
        if (popupRef.current) {
          popupRef.current.remove();
        }
        if (selectedRef.current.find(c => c.name === country.properties?.name)) {
          const name = selectedRef.current.find(c => c.name === country.properties?.name)?.name || country.properties?.name;
          const percentage = selectedRef.current.find(c => c.name === country.properties?.name)?.percentage || 0;
          // round to 2 decimals
          const roundedPercentage = Math.round(percentage * 100 * 100) / 100;
          const conteo = selectedRef.current.find(c => c.name === country.properties?.name)?.count || 0;
          const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
            .setLngLat((country.geometry.type === "Point") ? country.geometry.coordinates : e.lngLat)
            .setHTML(`<strong>${name}</strong>
              <br/> Porcentaje: ${roundedPercentage}%<br/>Conteo: ${conteo}`)
            .addTo(map);
          popupRef.current = popup;
          map.on("mouseleave", "countries-per-blue", () => {
            map.getCanvas().style.cursor = "";
            popup.remove();
            setHoveredCountry(null);
          });
        }
      });

      return () => map.remove();
    });

    mapRef.current = map;
    // Legend Control
    class LegendControl {
      onAdd(map: mapboxgl.Map) {
        this._map = map;
        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl legend-ctrl";

        const legendTitle = document.createElement("div");
        legendTitle.innerText = "Porcentaje";
        legendTitle.style.fontWeight = "bold";
        legendTitle.style.marginBottom = "8px";
        this._container.appendChild(legendTitle);

        const grades = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
        const labels = [];

        for (let i = 0; i < grades.length - 1; i++) {
          const from = grades[i];
          const to = grades[i + 1];
          const color = blueScale((from + to) / 2);

          const item = document.createElement("div");
          item.style.display = "flex";
          item.style.alignItems = "center";
          item.style.marginBottom = "4px";

          const colorBox = document.createElement("span");
          colorBox.style.width = "20px";
          colorBox.style.height = "20px";
          colorBox.style.backgroundColor = color;
          colorBox.style.marginRight = "8px";
          item.appendChild(colorBox);

          const label = document.createElement("span");
          label.innerText = `${Math.round(from * 100)}% - ${Math.round(to * 100)}%`;
          item.appendChild(label);

          this._container.appendChild(item);
        }

        return this._container;
      }

      onRemove() {
        this._container.parentNode?.removeChild(this._container);
        this._map = undefined;
      }
    } 
    map.addControl(new LegendControl());
  }, []);

  // Update fill-color when selectedCountries changes
  useEffect(() => {
  const map = mapRef.current;
  if (!map) return;

  if (!map.isStyleLoaded()) {
    map.once("load", () => {
      applyColors(map, selectedCountries);
    });
  } else {
    applyColors(map, selectedCountries);
  }
}, [selectedCountries]);

  function applyColors(map: mapboxgl.Map, selectedCountries) {
    if (!map.getLayer("countries-per-blue")) return;

    const matchExpression: any[] = ["match", ["get", "iso_3166_1"]];
    for (const row of selectedCountries) {
      if (!row.percentage) continue;
      matchExpression.push(row.code, blueScale(row.percentage));
    }
    matchExpression.push("transparent");
    map.setPaintProperty("countries-per-blue", "fill-color", matchExpression);
  }

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
    />
  );
}
