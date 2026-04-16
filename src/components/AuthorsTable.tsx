import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Card } from "./ui/card";
import { DropDownCommon } from "./dropDownCommonComponent";
import { ListFilter } from "lucide-react";
import { columnConfig } from "./configTable";

type ColumnConfig = typeof columnConfig;

type FilterableKeys = {
  [K in keyof ColumnConfig]: ColumnConfig[K]["filter"] extends true ? K : never
}[keyof ColumnConfig];

type FilterItem = {
  active: string[];
  available: string[];
  onChange: (value: string) => void;
};

interface AuthorsTableProps {
  filteredRows: any[];
  filters: Record<FilterableKeys, FilterItem>;
}

// -----------------------------
// Visible columns
// -----------------------------
function getVisibleColumns(data: any[]) {
  if (data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.filter(
    key => columnConfig[key as keyof ColumnConfig]?.visible
  ) as (keyof ColumnConfig)[];
}

export function AuthorsTable({ filteredRows, filters }: AuthorsTableProps) {
  const visibleColumns = getVisibleColumns(filteredRows);

  return (
    <Card className="h-full overflow-y-auto lg:row-span-4 p-4">
      
      <h2 className="sm:text-lg md:text-xl lg:text-xl xxl:text-3xl text-left font-semibold text-muted-foreground">
        Tabla de autores  
      </h2>

      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHeader>
          <TableRow>

            {visibleColumns.map((key) => {
              const config = columnConfig[key];
              const isTableFilter = config.locationofFilter === 'table'
              return (
                <TableHead key={key} className="w-64">
                  
                  {isTableFilter ? (
                    <div className="flex items-center gap-2">

                      {/* Icon */}
                      <ListFilter className="w-4 h-4 text-muted-foreground" />

                      {/* Dropdown */}
                      <DropDownCommon
                        available={filters[key as FilterableKeys]?.available || []}
                        active={filters[key as FilterableKeys]?.active || []}
                        onFilterChange={
                          filters[key as FilterableKeys]?.onChange || (() => {})
                        }
                        nombreVariable={config.label}
                      />

                    </div>
                  ) : (
                    <span>{config.label}</span>
                  )}

                </TableHead>
              );
            })}

          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredRows.map((row: any, index: number) => (
            <TableRow key={index}>

              {visibleColumns.map((key) => {
                const config = columnConfig[key];

                return (
                  <TableCell
                    key={key}
                    className="text-left w-64 truncate"
                  >
                    {config.format
                      ? config.format(row[key])
                      : row[key]}
                  </TableCell>
                );
              })}

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </Card>
  );
}