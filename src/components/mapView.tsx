import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { blueScale } from "./blueScale";
import { countryNameToIso } from "./countryToiso";
import { columnConfig } from "./configTable";
import { aggregateCounts } from "./filterItem";
import { calculatePercentages } from "./calculatePercentages";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Country centroids mapping (ISO 3166-1 alpha-2 to [longitude, latitude])
const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  "MULTINACIONAL": [0, 0], // Placeholder for multinational entries
  "US": [-95.7129, 37.0902], "GB": [-3.4360, 55.3781], "CA": [-106.3468, 56.1304],
  "AU": [133.7751, -25.2744], "DE": [10.4515, 51.1657], "FR": [2.2137, 46.2276],
  "JP": [138.2529, 36.2048], "IN": [78.9629, 20.5937], "BR": [-51.9253, -14.2350],
  "MX": [-102.5528, 23.6345], "ES": [-3.7492, 40.4637], "IT": [12.5674, 41.8719],
  "KR": [127.7669, 35.9078], "RU": [105.3188, 61.5240], "CN": [104.1954, 35.8617],
  "NL": [5.2913, 52.1326], "SE": [18.6435, 60.1282], "NO": [8.4689, 60.4720],
  "CH": [8.2275, 46.8182], "AT": [14.5501, 47.5162], "BE": [4.4699, 50.5039],
  "DK": [9.5018, 56.2639], "FI": [25.7482, 61.9241], "PL": [19.1451, 51.9194],
  "CZ": [15.4730, 49.8175], "HU": [19.5033, 47.1625], "RO": [24.9668, 45.9432],
  "GR": [21.8243, 39.0742], "PT": [-8.2245, 39.3999], "IE": [-8.2439, 53.4129],
  "ZA": [22.9375, -30.5595], "EG": [30.8025, 26.8206], "NG": [8.6753, 9.0820],
  "KE": [37.9083, -0.0236], "NG": [8.6753, 9.0820], "AR": [-63.6167, -38.4161],
  "CL": [-71.5430, -35.6751], "CO": [-74.2973, 4.5709], "PE": [-75.7321, -9.1900],
  "VE": [-66.5897, 6.4238], "TR": [35.2433, 38.9637], "SA": [45.0792, 23.8859],
  "AE": [53.8478, 23.4241], "IL": [34.8516, 31.0461], "IR": [53.6860, 32.4279],
  "PK": [69.3451, 30.3753], "BD": [90.3563, 23.6850], "TH": [100.9925, 15.8700],
  "MY": [101.6869, 4.2105], "SG": [103.8198, 1.3521], "PH": [121.7740, 12.8797],
  "ID": [113.9213, -2.1154], "VN": [105.8581, 20.8659], "TW": [120.9605, 23.6978],
  "HK": [114.1095, 22.3193], "GZ": [114.1095, 22.3193], "MM": [95.9560, 21.9162],
  "LK": [80.7718, 7.8731], "NP": [84.1240, 28.3949], "AF": [67.7099, 33.9391],
  "IQ": [44.3615, 33.3128], "SY": [36.2384, 34.8021], "JO": [35.9284, 31.9454],
  "LB": [35.8623, 33.8547], "PS": [35.2332, 31.9522], "KW": [47.4818, 29.3117],
  "QA": [51.1884, 25.3548], "BH": [50.5577, 26.0667], "OM": [56.3202, 21.4735],
  "YE": [48.5164, 15.5527], "CR": [-83.7534, 9.7489], "DO": [-70.1627, 18.7357],
  "CU": [-77.7812, 21.5218], "PA": [-80.7821, 8.5380], "GT": [-90.2308, 15.7835],
  "HN": [-86.2419, 15.2000], "SV": [-88.8965, 13.7942], "NI": [-85.2072, 12.8654],
  "BZ": [-88.7590, 17.1899], "JM": [-77.2975, 18.1096], "HT": [-72.2893, 18.9712],
  "TT": [-61.2225, 10.6918], "LC": [-61.1242, 13.9094], "BB": [-59.5432, 13.1939],
  "BS": [-76.6413, 25.0343], "AG": [-61.7964, 17.0578], "DM": [-61.2872, 15.4150],
  "GD": [-61.6875, 12.0679], "VC": [-61.2872, 12.9843], "KN": [-62.6830, 17.2574],
  "GY": [-58.9306, 4.8604], "SR": [-56.0271, 3.9193], "EC": [-78.1834, -1.8312],
  "BO": [-63.5887, -16.2902], "UY": [-55.7658, -32.5228], "PY": [-55.5, -23.4425],
  "VN": [105.8581, 20.8659], "CW": [-69.0097, 12.1696], "AW": [-69.9696, 12.1833],
  "BM": [-64.7545, 32.3078], "MU": [57.5522, -20.3484], "SC": [55.4920, -4.6796],
  "MG": [46.8697, -18.7669], "MW": [34.3015, -13.2543], "ZM": [27.8493, -13.1339],
  "ZW": [29.6100, -19.0154], "BW": [22.3285, -22.3285], "NA": [17.0832, -22.9375],
  "AO": [17.8739, -11.2027], "CG": [21.0936, -4.0383], "GA": [11.6045, -0.8037],
  "GH": [-2.0, 7.9465], "CI": [-5.5471, 7.5400], "SN": [-14.4524, 14.4974],
  "MA": [-5.0353, 31.7917], "DZ": [2.6392, 28.0339], "TN": [9.5375, 33.8869],
  "LY": [17.2283, 26.3351], "SD": [30.8025, 12.8628], "ET": [39.8699, 9.1450],
  "UG": [32.2903, 1.3733], "TZ": [34.8888, -6.3690], "MZ": [35.3691, -18.6657],
  "LV": [24.6034, 56.8796], "LT": [23.8813, 54.6872], "EE": [25.0136, 58.5953],
  "BG": [25.4858, 42.7339], "HR": [15.2, 45.1], "SI": [14.9955, 46.1512],
  "SK": [19.6990, 48.6690], "MD": [28.3699, 47.4116], "UA": [31.1656, 48.3794],
  "BY": [27.9534, 53.7098], "KZ": [68.6738, 48.0196], "UZ": [64.5853, 41.3775],
  "TJ": [71.2761, 38.8610], "KG": [74.6671, 41.2044], "TM": [59.5563, 38.9697],
  "MN": [103.8467, 46.8625], "LA": [104.8694, 19.8523], "KH": [104.8901, 12.5657],
  "BT": [90.4336, 27.5142], "MV": [73.5081, 3.2028], "BN": [114.7277, 4.5353],
  "TL": [124.1353, -8.8383], "FM": [158.1550, 9.4915], "MH": [171.1845, 7.1315],
  "PW": [134.5826, 7.3150], "NC": [165.6181, -20.9042], "FJ": [177.9697, -17.7134],
  "WS": [-172.1046, -13.7590], "KI": [-157.5, 1.3521], "TO": [-175.2, -21.1789],
  "NZ": [174.8860, -40.9006], "SB": [160.1562, -9.6412], "VU": [166.9592, -17.7404],
  "PF": [-149.4060, -17.5297], "GU": [144.7937, 13.4443], "VI": [-64.8963, 18.3358],
  "AS": [-170.1330, -14.2710], "MP": [145.7781, 15.0979], "PR": [-66.5901, 18.2208],
};

// Helper function to get country coordinates
function getCountryCoordinates(countryCode: string): [number, number] | null {
  return COUNTRY_CENTROIDS[countryCode.toUpperCase()] || null;
}

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
  filters,
  filteredRows,
}: {
  filters: {
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
  filteredRows: any[];
}) {

  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const availableRef = useRef(filters?.con.available);
  const countriesDataRef = useRef<Record<string, { name: string; count: number; percentage: number }>>({});

  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const hoveredRef = useRef(hoveredCountry);

  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Calculate country data from filtered rows
  useEffect(() => {
    const rawCounts = aggregateCounts({
      rows: filteredRows,
      getValue: (item: any) => item.countryISO,
      split: true,
    });

    const countryCounts = rawCounts.map(a => ({
      name: a.name,
      code: a.name,
      count: a.value,
    }));

    const withPercentages = calculatePercentages(countryCounts);
    
    // Store in ref for use in event handlers
    countriesDataRef.current = Object.fromEntries(
      withPercentages.map(c => [c.code, { name: c.name, count: c.count, percentage: c.percentage || 0 }])
    );
  }, [filteredRows, filters.con?.active]);

  useEffect(() => {
    popupRef.current?.remove();
    hoveredRef.current = hoveredCountry;
  }, [hoveredCountry]);

  useEffect(() => {
    availableRef.current = filters.con?.available ?? [];
  }, [filters.con?.available]);

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

      // Add source and layers for country count circles
      map.addSource("country-counts", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // Circle background layer
      map.addLayer({
        id: "country-counts-circles",
        type: "circle",
        source: "country-counts",
        paint: {
          "circle-radius": 18,
          "circle-color": "#1f2937",
          "circle-opacity": 0.9,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Text layer for count
      map.addLayer({
        id: "country-counts-text",
        type: "symbol",
        source: "country-counts",
        layout: {
          "text-field": ["get", "count"],
          "text-size": 12,
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },
        paint: {
          "text-color": "#fff",
          "text-halo-color": "#1f2937",
          "text-halo-width": 1.5,
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
        if (!availableRef.current.includes(isoCode)) return;
        filters.con?.onChange(isoCode);
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

        const countryData = countriesDataRef.current[iso];
        if (!countryData) return;

        const roundedPercentage = Math.round(countryData.percentage * 100 * 100) / 100;

        const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>${countryData.name}</strong>
            <br/>Porcentaje: ${roundedPercentage}%
            <br/>Conteo: ${countryData.count}
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
      map.once("load", () => applyColors(map, filters.con?.active ?? []));
    } else {
      applyColors(map, filters.con?.active ?? []);
    }
  }, [filters.con?.active, filters.con?.available, filteredRows]);

  function applyColors(map: mapboxgl.Map, selectedCountries: string[]) {
    if (!map.getLayer("countries-per-blue")) return;

    // Calculate country counts and percentages from filteredRows
    const rawCounts = aggregateCounts({
      rows: filteredRows,
      getValue: (item: any) => item.countryISO,
      split: true,
    });

    const countryCounts = rawCounts.map(a => ({
      name: a.name,
      code: a.name, // This is the ISO code from countryISO
      count: a.value,
    }));

    const countWithPercentages = calculatePercentages(countryCounts);

    const matchExpression: any[] = ["match", ["get", "iso_3166_1"]];

    // If no countries selected, show all available countries in light blue
    if (selectedCountries.length === 0) {
      const allCountries = filters.con?.available ?? [];
      for (const countryCode of allCountries) {
        matchExpression.push(countryCode, "transparent");
      }
    } else {
      // Color selected countries based on their percentage
      for (const countryCode of selectedCountries) {
        const countryData = countWithPercentages.find(c => c.code === countryCode);
        const color = countryData?.percentage
          ? blueScale(countryData.percentage)
          : "#0066ff"; // Default darker blue if no data
        matchExpression.push(countryCode, color);
      }
      // Light blue for all other available countries
      const allCountries = filters.con?.available ?? [];
      for (const countryCode of allCountries) {
        if (!selectedCountries.includes(countryCode)) {
          matchExpression.push(countryCode, "transparent");
        }
      }
    }

    matchExpression.push("transparent");

    map.setPaintProperty("countries-per-blue", "fill-color", matchExpression);

    // Update circle markers with ds_con counts
    if (map.getSource("country-counts")) {
      // Calculate ds_con counts from filteredRows
      const dsRawCounts = aggregateCounts({
        rows: filteredRows,
        getValue: (item: any) => item.dataSourceCountryISO,
        split: true,
      });

      const dsCounts = dsRawCounts.map(a => ({
        name: a.name,
        code: a.name,
        count: a.value,
      }));

      const features = (filters.ds_con?.active ?? [])
        .map((countryCode) => {
          const countryData = dsCounts.find(c => c.code === countryCode);
          if (!countryData) return null;
          
          const coords = getCountryCoordinates(countryCode);
          if (!coords) return null;

          return {
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: coords,
            },
            properties: {
              count: countryData.count,
              name: countryData.name,
              code: countryData.code,
            },
          };
        })
        .filter((f) => f !== null);

      (map.getSource("country-counts") as any).setData({
        type: "FeatureCollection",
        features: features,
      });
    }
  }

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
    />
  );
}