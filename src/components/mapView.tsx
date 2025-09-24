import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapComponent({ selectedCountries }: { selectedCountries: string[] }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Only initialize the map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [0, 20],
      projection: 'mercator',
      zoom: 2,
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.on("load", () => {
      map.addSource("south-america", {
        type: "geojson",
        data: "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
      });
      map.addLayer({
        id: "south-america-layer",
        type: "fill",
        source: "south-america",
        paint: {
          "fill-color": [
            'case',
            ['in', ['get', 'ISO3166-1-Alpha-3'], ['literal', selectedCountries]],
            '#030213',
            'transparent'
          ],
          "fill-opacity": 0.7,
        },
      });
    });
    map.on("click", "south-america-layer", (e) => {
      const country = e.features?.[0]?.properties?.name;
      if (country) alert(`Clicked on ${country}`);
    });
    mapRef.current = map;
    return () => map.remove();
  }, []);

  // Update paint property when selectedCountries changes
  useEffect(() => {
  const map = mapRef.current;
  if (!map) return;

  if (map.getLayer("south-america-layer")) {
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();

    map.setPaintProperty(
      "south-america-layer",
      "fill-color",
      [
        "case",
        ["in", ["get", "ISO3166-1-Alpha-3"], ["literal", selectedCountries]],
        primaryColor,
        "transparent"
      ]
    );
  }
}, [selectedCountries]);


  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
    />
  );
}
