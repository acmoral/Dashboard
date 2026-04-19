import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardSection } from './components/DashboardSection';
import { AuthorsTable } from './components/AuthorsTable';
import { fetchDatabase } from "./components/FetchDatabase";
import { AcercaDe } from './components/AcercaDe';
import { countryNameToIso } from "./components/countryToiso";
import { aggregateCounts } from './components/filterItem';
import { calculatePercentages } from './components/calculatePercentages';
import { filterRows } from './components/filterRows';
import { DashboardHeader } from './components/DashboardHeader';
import { columnConfig } from './components/configTable';

export default function App() {

  // -----------------------------
  // TYPES
  // -----------------------------
  type ColumnConfig = typeof columnConfig;

  type FilterableKeys = {
    [K in keyof ColumnConfig]: ColumnConfig[K]["filter"] extends true ? K : never
  }[keyof ColumnConfig];

  type AggregationItem = {
    name: string;
    value: number;
    color: string;
  };

  // -----------------------------
  // INITIAL STATE
  // -----------------------------
  const initialFilters = Object.fromEntries(
    Object.entries(columnConfig)
      .filter(([_, config]) => config.filter)
      .map(([key]) => [key, [] as string[]])
  ) as Record<FilterableKeys, string[]>;

  const initialAggregations = Object.fromEntries(
    Object.entries(columnConfig)
      .filter(([_, config]) => config.filter)
      .map(([key]) => [key, [] as AggregationItem[]])
  ) as Record<FilterableKeys, AggregationItem[]>;

  const [filters, setFilters] = useState(initialFilters);
  const [aggregations, setAggregations] = useState(initialAggregations);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [filteredRows, setFilteredRows] = useState<Record<string, string>[]>([]);

  // -----------------------------
  // FILTER HANDLER
  // -----------------------------
  const handleFilterChange = (
    key: FilterableKeys,
    value: string,
    allItems: string[]
  ) => {
    setFilters(prev => {
      const activeItems = prev[key];

      if (value === 'all') {
        return {
          ...prev,
          [key]: [],
        };
      }

      if (activeItems.includes(value)) {
        return {
          ...prev,
          [key]: activeItems.filter(item => item !== value),
        };
      }

      return {
        ...prev,
        [key]: [...activeItems, value],
      };
    });
  };

  // -----------------------------
  // ENRICH DATA
  // -----------------------------
  const enrichRowsWithISO = async (rows: any[]) => {
    return Promise.all(
      rows.map(async (item, idx) => {
        const rawCountries = item.con || '';
        const splitCountries = rawCountries
          .split(';')
          .map((c: string) => c.trim())
          .filter(Boolean);



        const isoCodes = await Promise.all(
          splitCountries.map(async (country) => {
            // Handle "Multinacional"/"Multinational" as special case
            const countryLower = country.toLowerCase();
            if (countryLower === 'multinacional' || countryLower === 'multinational') {
              return 'MULTINACIONAL';
            }
            return countryNameToIso(country);
          })
        );

        // Also convert ds_con to ISO codes
        const rawDsCountries = item.ds_con || '';
        const splitDsCountries = rawDsCountries
          .split(';')
          .map((c: string) => c.trim())
          .filter(Boolean);

        const dsIsoCodes = await Promise.all(
          splitDsCountries.map(async (country) => {
            // Handle "Multinacional"/"Multinational" as special case
            const countryLower = country.toLowerCase();
            if (countryLower === 'multinacional' || countryLower === 'multinational') {
              return 'MULTINACIONAL';
            }
            return countryNameToIso(country);
          })
        );

        const enrichedCountryISO = isoCodes.filter(Boolean).join(';');
        const enrichedDataSourceISO = dsIsoCodes.filter(Boolean).join(';');
        
        return {
          ...item,
          countryISO: enrichedCountryISO,
          dataSourceCountryISO: enrichedDataSourceISO,
        };
      })
    );
  };

  // -----------------------------
  // FETCH DATA
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDatabase();
      const enriched = await enrichRowsWithISO(data);
      setRows(enriched);
      setFilteredRows(enriched);
    };
    fetchData();
  }, []);

  // -----------------------------
  // GET FILTERABLE KEYS (SAFE)
  // -----------------------------
  const filterableKeys = Object.keys(columnConfig).filter(
    key => columnConfig[key as keyof ColumnConfig].filter
  ) as FilterableKeys[];

  // -----------------------------
  // FILTERING (NO TS ERRORS)
  // -----------------------------
  useEffect(() => {
    const run = async () => {
      let result = rows;

      for (const key of filterableKeys) {
        const config = columnConfig[key];
        const values = filters[key];

        if (!values.length) continue;

        // For ds_con, use the enriched ISO field for filtering
        let field = config.field ?? key;
        if (key === 'ds_con') {
          field = 'dataSourceCountryISO';
        }


        if (config.async) {
          result = await filterRows(values, result, field, true);
        } else {
          result = filterRows(values, result, field);
        }
        
      }

      setFilteredRows(result);
    };

    run();
  }, [rows, filters]);

  // -----------------------------
  // AGGREGATIONS CONFIG
  // -----------------------------
  const aggregationsConfig: Record<FilterableKeys, any> = {
    cor_aut: { getValue: (item: any) => item.cor_aut },
    design: { getValue: (item: any) => item.design },
    dom: { getValue: (item: any) => item.dom, split: true },
    dis: { getValue: (item: any) => item.dis, split: true },
    drug: { getValue: (item: any) => item.drug, split: true },
    con: { getValue: (item: any) => item.countryISO, split: true },
    ds_ty: { getValue: (item: any) => item.ds_ty, split: true },
    ds_reg: { getValue: (item: any) => item.ds_reg, split: true },
    ds_con: { getValue: (item: any) => item.dataSourceCountryISO, split: true },
  };

  // -----------------------------
  // FILTER OPTIONS
  // -----------------------------
  const filterOptions = Object.fromEntries(
    Object.entries(aggregationsConfig).map(([key, config]) => [
      key,
      (aggregateCounts({ rows, ...config }) ?? []).map(a => a.name),
    ])
  ) as Record<FilterableKeys, string[]>;

  // -----------------------------
  // HEADER FILTERS
  // -----------------------------
  const headerFilters = Object.fromEntries(
  Object.entries(filters)
    .filter(([key]) =>
      columnConfig[key as FilterableKeys]?.locationofFilter === "header"
    )
    .map(([key, active]) => {
      const typedKey = key as FilterableKeys;
      const available = filterOptions[typedKey];

      return [
        key,
        {
          active,
          available,
          onChange: (value: string) =>
            handleFilterChange(typedKey, value, available),
        },
      ];
    })
);
  // -----------------------------
  // SIDEBAR FILTERS
  // -----------------------------
  const sidebarFilters = Object.fromEntries(
  Object.entries(filters)
    .filter(([key]) =>
      columnConfig[key as FilterableKeys]?.locationofFilter === "sidebar"
    )
    .map(([key, active]) => {
      const typedKey = key as FilterableKeys;
      const available = filterOptions[typedKey];
      
      return [
        key,
        {
          active,
          available,
          onChange: (value: string) =>
            handleFilterChange(typedKey, value, available),
        },
      ];
    })
) as Record<string, FilterItem>;

  // -----------------------------
  // TABLE FILTERS
  // -----------------------------
    const tableFilters = Object.fromEntries(
  Object.entries(filters)
    .filter(([key]) =>
      columnConfig[key as FilterableKeys]?.locationofFilter === "table"
    )
    .map(([key, active]) => {
      const typedKey = key as FilterableKeys;
      const available = filterOptions[typedKey];

      return [
        key,
        {
          active,
          available,
          onChange: (value: string) =>
            handleFilterChange(typedKey, value, available),
        },
      ];
    })
);
  // -----------------------------
  // MAP FILTERS
  // ------------------------------
  const mapFilters = Object.fromEntries(
  Object.entries(filters)
    .filter(([key]) =>
      columnConfig[key as FilterableKeys]?.locationofFilter === "map"
    )
    .map(([key, active]) => {
      const typedKey = key as FilterableKeys;
      const available = filterOptions[typedKey];

      return [
        key,
        {
          active,
          available,
          onChange: (value: string) =>
            handleFilterChange(typedKey, value, available),
        },
      ];
    })
);

  // Country counts from aggregations
  // For filter card options - always show all countries
  const allCountriesCounts = {
    con: (() => {
      const rawCounts = aggregateCounts({
        rows: rows,
        getValue: (item: any) => item.countryISO,
        split: true,
      });
      const counts = rawCounts.map(a => ({
        name: a.name,
        code: a.name,
        count: a.value,
      }));
      return calculatePercentages(counts);
    })(),
    ds_con: (() => {
      const rawCounts = aggregateCounts({
        rows: rows,
        getValue: (item: any) => item.dataSourceCountryISO,
        split: true,
      });
      const counts = rawCounts.map(a => ({
        name: a.name,
        code: a.name,
        count: a.value,
      }));
      return calculatePercentages(counts);
    })(),
  };

  // Country counts for map display - show filtered data
  const mapCountriesCounts = {
    con: (() => {
      const rawCounts = aggregateCounts({
        rows: filteredRows,
        getValue: (item: any) => item.countryISO,
        split: true,
      });
      const counts = rawCounts.map(a => ({
        name: a.name,
        code: a.name,
        count: a.value,
      }));
      return calculatePercentages(counts);
    })(),
    ds_con: (() => {
      const rawCounts = aggregateCounts({
        rows: filteredRows,
        getValue: (item: any) => item.dataSourceCountryISO,
        split: true,
      });
      const counts = rawCounts.map(a => ({
        name: a.name,
        code: a.name,
        count: a.value,
      }));
      return calculatePercentages(counts);
    })(),
  };

  // -----------------------------
  // AGGREGATIONS UPDATE
  // -----------------------------
  useEffect(() => {
    const result = Object.fromEntries(
      Object.entries(aggregationsConfig).map(([key, config]) => [
        key,
        aggregateCounts({ rows: filteredRows, ...config }),
      ])
    ) as Record<FilterableKeys, AggregationItem[]>;

    setAggregations(result);
  }, [filteredRows]);

  // -----------------------------
  // UI HANDLERS
  // -----------------------------
  const handleItemClick = (item: string) => setActiveItem(item);
  const handleTabChange = (tab: string) => setActiveTab(tab);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="flex h-svh">
      <Sidebar
        navigation={{ activeItem, onTabClick: handleTabChange, onItemClick: handleItemClick }}
        filters={sidebarFilters}
      />

      <div className="h-full w-full grid grid-rows-[30%_70%]">
        <div className="overflow-hidden">
          <div className="w-full h-full">

            {activeTab === 'dashboard' ? (
              <div className="h-full flex flex-col gap-4 p-3 overflow-hidden">

                <div className="flex-shrink-0">
                  <DashboardHeader filters={headerFilters} />
                </div>

                <div className="flex-1 overflow-y-auto">
                  <DashboardSection
                    mapFilters={mapFilters}
                    tableFilters={tableFilters}
                    filteredRows={filteredRows}
                    countryCounts={allCountriesCounts}
                    mapCounts={mapCountriesCounts}
                  />
                </div>

              </div>
            ) : activeTab === 'acerca' ? (
              <AcercaDe />
            )  : null}
          </div>
        </div>
      </div>
    </div>
  );
}