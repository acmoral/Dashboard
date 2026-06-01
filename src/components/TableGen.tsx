import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Card } from "./ui/card";
import { DropDownCommon } from "./dropDownCommonComponent";
import { ChevronDown, ListFilter, ChevronUp } from "lucide-react";
import { columnConfig } from "./configTable";
import { useState, useRef, useEffect } from "react";
type ColumnConfig = typeof columnConfig;
type FilterableKeys = {
  [K in keyof ColumnConfig]: ColumnConfig[K]["filter"] extends true ? K : never
}[keyof ColumnConfig];

function ExpandableCell({ content, columnKey, rowIndex }: { content: any; columnKey: string; rowIndex: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const MAX_HEIGHT = 100  ; // 10rem in pixels

  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > MAX_HEIGHT;
      setHasOverflow(isOverflowing);
    }
  }, [content]);

  return (
    <div>
      <div
        ref={contentRef}
        className="text-left whitespace-normal break-words align-top"
        style={
          isExpanded
            ? { maxHeight: "none" }
            : { maxHeight: `${MAX_HEIGHT}px`, overflow: "hidden" }
        }
      >
        {content}
      </div>
      {hasOverflow && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 px-3 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
        </button>
      )}
    </div>
  );
}

export function TableGen({ visibleColumns, filteredRows, filters, tableType }: { visibleColumns: string[]; filteredRows: any[]; filters: Record<string, any>; tableType: 'authors' | 'databases' }) {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const isDatabaseTable = tableType === 'databases';

  if (filteredRows.length === 0) {
    return (
      <div className="p-6 text-sm text-center text-muted-foreground">
        No data given the current filters
      </div>
    );
  }

    return (
      <div className="flex flex-col h-full min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Table className="h-full" style={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHeader>
              <TableRow >

            {visibleColumns.map((key) => {
              const config = columnConfig[key];
              const isTableFilter = config.locationofFilter === 'table'
              return (
                <TableHead key={key} className="w-64">
                  
                  {isTableFilter ? (
                    <div >

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

            const rowKey = row.id ?? row.cor_aut ?? index;

            return (

                  <TableRow
                    key={rowKey}
                    onMouseEnter={() => setHoveredRowIndex(index)}
                    onMouseLeave={() => {
                      setHoveredRowIndex(null);
                      setHoverPosition(null);
                    }}
                    onMouseMove={(event) =>
                      setHoverPosition({ x: event.clientX, y: event.clientY })
                    }
                    className={hoveredRowIndex === index ? "bg-gray-50" : ""}
                  >
                    {visibleColumns.map((key, cellIndex) => {
                      const config = columnConfig[key];

                      return (
                       <TableCell
                        key={key}
                        className="text-left w-64 align-top overflow-visible"
                      >
                        <div className="relative">
                          <ExpandableCell
                            content={config.format ? config.format(row[key]) : row[key]}
                            columnKey={key}
                            rowIndex={index}
                          />
                          {isDatabaseTable && cellIndex === 0 && hoveredRowIndex === index && row.cit && hoverPosition && (
                            <div
                              className="fixed z-20 w-20 rounded border border-slate-200 bg-white p-2 text-xs shadow-lg"
                              style={{
                                left: hoverPosition.x + 12,
                                top: hoverPosition.y + 12,
                                maxWidth: '24rem',
                              }}
                            >
                              <div className="font-semibold">Citation</div>
                              <div className="whitespace-normal">{row.cit}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      );
                    })}
                  </TableRow>
            );
          })}
        </TableBody>

          </Table>
        </div>
      </div>
    );
    }