import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { blueScale } from "./blueScale";
import { countryNameToIso } from "./countryToiso";
import { countCountries } from "./countCountries";
import { columnConfig } from "./configTable";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

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

export default function MapComponent({
  availableCountries,
  counts,
  filteredRows,
  setCounts,
  setFilterCountries
}: {
  availableCountries: string[];
  counts: CountryType[];
  filteredRows: any[];
  setCounts: (counts: CountryType[] | ((prev: CountryType[]) => CountryType[])) => void;
  setFilterCountries: (
    key: FilterableKeys,
    value: string,
    allItems: string[]
  ) => void;
}) {

  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const availableRef = useRef(availableCountries);
  const selectedRef = useRef(counts);

  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const hoveredRef = useRef(hoveredCountry);

  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // -----------------------------
  // UPDATE COUNTS
  // -----------------------------
  useEffect(() => {
    popupRef.current?.remove();
    setHoveredCountry(null);

    const run = async () => {
      const countriesData = await countCountries({ filteredRows });
      setCounts(countriesData);
    };

    run();
  }, [filteredRows]);

  useEffect(() => {
    selectedRef.current = counts;
  }, [counts]);

  useEffect(() => {
    hoveredRef.current = hoveredCountry;
  }, [hoveredCountry]);

  useEffect(() => {
    availableRef.current = availableCountries;
  }, [availableCountries]);

  // -----------------------------
  // INIT MAP
  // -----------------------------
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.297333, 4.570868],
      projection: "mercator",
      zoom: 2,
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      map.addSource("countries", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });

      map.addLayer({
        id: "countries-per-blue",
        type: "fill",
        source: "countries",
        "source-layer": "country_boundaries",
        paint: {
          "fill-color": "transparent",
          "fill-opacity": 0.8,
        },
      });

      // -----------------------------
      // CLICK
      // -----------------------------
      map.on("click", "countries-per-blue", async (e) => {
        if (!e.features?.length) return;

        const feature = e.features[0];
        const isoFromFeature = feature.properties?.iso_3166_1?.toUpperCase();

        const isoCode =
          isoFromFeature ||
          await countryNameToIso(feature.properties?.name);

        if (!isoCode) return;

        setFilterCountries("con", isoCode, availableCountries);
      });

      // -----------------------------
      // HOVER
      // -----------------------------
      map.on("mousemove", "countries-per-blue", (e) => {
        if (!e.features?.length) return;

        const country = e.features[0];
        const iso = country.properties?.iso_3166_1;

        if (hoveredRef.current === country.properties?.name) return;

        setHoveredCountry(country.properties?.name || null);
        map.getCanvas().style.cursor = "pointer";

        popupRef.current?.remove();

        const selected = selectedRef.current.find(c => c.code === iso);
        if (!selected) return;

        const roundedPercentage =
          Math.round((selected.percentage || 0) * 100 * 100) / 100;

        const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>${selected.name}</strong>
            <br/>Porcentaje: ${roundedPercentage}%
            <br/>Conteo: ${selected.count}
          `)
          .addTo(map);

        popupRef.current = popup;

        map.on("mouseleave", "countries-per-blue", () => {
          map.getCanvas().style.cursor = "";
          popup.remove();
          setHoveredCountry(null);
        });
      });
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // -----------------------------
  // UPDATE COLORS
  // -----------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!map.isStyleLoaded()) {
      map.once("load", () => applyColors(map, counts));
    } else {
      applyColors(map, counts);
    }
  }, [counts]);

  function applyColors(map: mapboxgl.Map, data: CountryType[]) {
    if (!map.getLayer("countries-per-blue")) return;

    if (data.length === 0) {
      map.setPaintProperty("countries-per-blue", "fill-color", "transparent");
      return;
    }

    const matchExpression: any[] = ["match", ["get", "iso_3166_1"]];

    for (const row of data) {
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