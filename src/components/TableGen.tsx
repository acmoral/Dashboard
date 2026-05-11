import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Card } from "./ui/card";
import { DropDownCommon } from "./dropDownCommonComponent";
import { ListFilter } from "lucide-react";
import { columnConfig } from "./configTable";
import { useState } from "react";
type ColumnConfig = typeof columnConfig;
type FilterableKeys = {
  [K in keyof ColumnConfig]: ColumnConfig[K]["filter"] extends true ? K : never
}[keyof ColumnConfig];
export function TableGen({ visibleColumns, filteredRows, filters }: { visibleColumns: string[]; filteredRows: any[]; filters: Record<string, any> }) {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
    return (
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
          {filteredRows.map((row: any, index: number) => {
            // Get popUp fields (popUp: true and visible: false)
            const popUpFields = Object.entries(columnConfig)
              .filter(([_, config]) => config.popUp && !config.visible)
              .map(([key, config]) => ({
                key,
                label: config.label,
                value: config.format ? config.format(row[key]) : row[key],
              }));

            return (

                  <TableRow
                    onMouseEnter={() => setHoveredRowIndex(index)}
                    onMouseLeave={() => setHoveredRowIndex(null)}
                    className={hoveredRowIndex === index ? "bg-accent/50" : ""}
                  >
                    {visibleColumns.map((key) => {
                      const config = columnConfig[key];

                      return (
                       <TableCell
                        key={key}
                        className="text-left w-64 whitespace-normal break-words align-top"
                      >
                        <div className="max-h-40 overflow-y-auto">
                          {config.format
                            ? config.format(row[key])
                            : row[key]}
                        </div>
                      </TableCell>
                      );
                    })}
                  </TableRow>
            );
          })}
        </TableBody>

      </Table>
    );
    }