import { useState, useEffect, use } from 'react';
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

  // -----------------------------
  // INITIAL STATE
  // -----------------------------
  const initialFilters = Object.fromEntries(
    Object.entries(columnConfig)
      .filter(([_, config]) => config.filter)
      .map(([key]) => [key, [] as string[]])
  ) as Record<FilterableKeys, string[]>;

  const [filters, setFilters] = useState(initialFilters);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [filteredRows, setFilteredRows] = useState<Record<string, string>[]>([]);
  const [visibleState, setVisibleState] = useState<string>('authors');
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
  // GET FILTERABLE KEYS 
  // -----------------------------
  const filterableKeys = Object.keys(columnConfig).filter((key) => {
  const config = columnConfig[key as keyof ColumnConfig];

    return (
      config.filter &&
      config.visible === visibleState
    );
  }) as FilterableKeys[];

  // -----------------------------
  // FILTERING 
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
          result = filterRows(values, result, field,true);
        }
        
      }

      setFilteredRows(result);
    };

    run();
  }, [rows, filters]);

  // -----------------------------
  // AGGREGATIONS CONFIG
  // -----------------------------
  const aggregationsConfig = Object.fromEntries(
  Object.entries(columnConfig)
    .filter(([_, config]) => config.filter)
    .map(([key, config]) => {
      const field = config.field ?? key;

      return [
        key,
        {
          getValue: (item: any) => item[field],
          split: config.aggregation?.split ?? false,
        },
      ];
    })
) as Record<FilterableKeys, any>;

  // -----------------------------
  // FILTER OPTIONS
  // -----------------------------
  const filterOptions = Object.fromEntries(
    Object.entries(aggregationsConfig).map(([key, config]) => [
      key,
      (aggregateCounts({ rows, ...config }) ?? []).map(a => a.name),
    ])
  ) as Record<FilterableKeys, string[]>;
  const buildFiltersByLocation = (location: string) =>
  Object.fromEntries(
    Object.entries(filters)
      .filter(([key]) => {
        const config = columnConfig[key as FilterableKeys];
        return (
          config?.locationofFilter === location &&
          config?.visible === visibleState
        );
      })
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
  // FILTERS BY LOCATION
  // -----------------------------
  const headerFilters = buildFiltersByLocation('header');

  const sidebarFilters = buildFiltersByLocation('sidebar');

  const tableFilters = buildFiltersByLocation('table');

  const mapFilters = buildFiltersByLocation('map');
  // Country counts from aggregations
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
  // UI HANDLERS
  // -----------------------------
  const handleItemClick = (item: string) => setActiveItem(item);
  const handleTabChange = (tab: string) => setActiveTab(tab);
  const handleClearFilters = () => {
    setFilters(initialFilters);
  };
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
                  <DashboardHeader onClearFilters={handleClearFilters} filters={headerFilters} />
                </div>

                <div className="flex-1 overflow-y-auto">
                  <DashboardSection
                    visibleState={visibleState}
                    setVisibleState={setVisibleState}
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