import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
// Scale from light blue (rgb(200, 220, 255)) to dark blue (rgb(0, 0, 130))
function blueScale(t: number) {
  // clamp t between 0–1
  t = Math.min(1, Math.max(0, t));

  // start = #00a8e8 (rgba(213, 244, 255, 1))
  const r1 = 213, g1 = 244, b1 = 255;
  // end   = #003459 (rgb(0, 52, 89))
  const r2 = 0, g2 = 52, b2 = 89;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}
export default function MapComponent({
  selectedCountries,
}: {
  selectedCountries: {
    name: string;
    code: string;
    count: number;
    percentage?: number;
  }[];
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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
      map.on("click", "countries-per-blue", (e) => {
        const country = e.features?.[0]?.properties?.name;
        if (country) alert(`Clicked on ${country}`);
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
