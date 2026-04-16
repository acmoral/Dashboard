import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CountrySection } from './components/CountrySection';
import { AuthorsTable } from './components/AuthorsTable';
import { fetchDatabase } from "./components/FetchDatabase";
import { AcercaDe } from './components/AcercaDe';
import { countryNameToIso } from "./components/countryToiso";
import { aggregateCounts } from './components/filterItem';
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
        return initialFilters;
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
      rows.map(async (item) => {
        const rawCountries = item.con || '';
        const splitCountries = rawCountries
          .split(';')
          .map((c: string) => c.trim())
          .filter(Boolean);

        const isoCodes = await Promise.all(
          splitCountries.map(countryNameToIso)
        );

        return {
          ...item,
          countryISO: isoCodes.filter(Boolean).join(';'),
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

        const field = config.field ?? key;

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
    ds_con: { getValue: (item: any) => item.ds_con },
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
);
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
                  <DashboardHeader filters={sidebarFilters} />
                </div>

                <div className="flex-1 overflow-y-auto">
                  <CountrySection
                    availableCountries={aggregations.con.map(c => c.name)}
                    filterCountries={filters.con}
                    filteredRows={filteredRows}
                    setFilterCountries={handleFilterChange}
                  />
                </div>

              </div>
            ) : activeTab === 'acerca' ? (
              <AcercaDe />
            ) : activeTab === 'Tabla de autores' ? (
              <div className="h-full flex flex-col gap-4 p-3 overflow-hidden">
                <DashboardHeader filters={sidebarFilters} />
                <AuthorsTable filteredRows={filteredRows} filters={tableFilters} />
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
}