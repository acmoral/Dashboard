import { ListFilter } from "lucide-react";
import { DropDownCommon } from "./dropDownCommonComponent";
import { columnConfig } from "./configTable";

type FilterItem = {
  active: string[];
  available: string[];
  onChange: (value: string) => void;
};

type ColumnConfig = typeof columnConfig;

type FilterableKeys = {
  [K in keyof ColumnConfig]: ColumnConfig[K]["filter"] extends true ? K : never
}[keyof ColumnConfig];

interface DashboardHeaderProps {
  filters: Record<FilterableKeys, FilterItem>;
}

export function DashboardHeader({ filters }: DashboardHeaderProps) {

  const filterConfigs = Object.entries(filters).map(([key, filter]) => {
    const typedKey = key as FilterableKeys;

    return {
      key: typedKey,
      label: columnConfig[typedKey].label,
      ...filter,
    };
  });

  return (
    <div className="bg-white border-b border-border">
      <div className="p-4">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <ListFilter className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-around items-center gap-4">
          {filterConfigs.map(filter => (
            <div key={filter.key} className="flex flex-col w-50">

              <div className="relative">
                <DropDownCommon
                  available={filter.available}
                  active={filter.active}
                  onFilterChange={filter.onChange}
                  nombreVariable={filter.label}
                />
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}