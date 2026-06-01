import { Card } from "./ui/card";
import { columnConfig } from "./configTable";
import {TableGen} from "./TableGen";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import groupByAuthor from "./groupByAuthor";
import groupByRowDatabases from "./groupByRowDatabases";
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
  visibleState: string;
  setVisibleState: (state: string) => void;
  filteredRows: any[];
  filters: Record<FilterableKeys, FilterItem>;
}

// -----------------------------
// Visible columns
// -----------------------------
function getVisibleColumns(data: any[], whereToShow: 'authors' | 'databases' = 'authors'): (keyof ColumnConfig)[] {
  // Use the explicit ordering from `columnConfig` rather than the order of fields
  // in the data rows. This lets you control column order by arranging
  // the entries in `src/components/configTable.tsx` or by adding an `order`
  // property to the config and sorting by it (see note below).
  const keys = Object.keys(columnConfig);
  return keys.filter(
    key => columnConfig[key as keyof ColumnConfig]?.visible === whereToShow || columnConfig[key as keyof ColumnConfig]?.visible === 'both'
  ) as (keyof ColumnConfig)[];
}

export function AuthorsTable({
  visibleState,
  setVisibleState,
  filteredRows,
  filters
}: AuthorsTableProps) {

  const visibleColumnsDatabases = getVisibleColumns(filteredRows, 'databases');
  const visibleColumnsAuthors = getVisibleColumns(filteredRows, 'authors');

  const handleTabChange = (value: string) => {
    setVisibleState(value); // "authors" or "databases"
  };
  const displayedRows =
  visibleState === "authors"
    ? groupByAuthor(filteredRows)
    : groupByRowDatabases(filteredRows);
  return (
    <Card className="h-full overflow-hidden lg:row-span-4 p-6">
      <Tabs 
        value={visibleState} 
        onValueChange={handleTabChange}
        className="w-full h-full"
      >
        <div className="sticky top-4 z-30 bg-background py-4">
          <TabsList>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="databases">Databases</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="databases" className="flex-1 min-h-0 overflow-hidden">
          <TableGen 
            visibleColumns={visibleColumnsDatabases} 
            filteredRows={displayedRows} 
            filters={filters} 
            tableType="databases"
          />
        </TabsContent>

        <TabsContent value="authors" className="flex-1 min-h-0 overflow-hidden">
          <TableGen 
            visibleColumns={visibleColumnsAuthors} 
            filteredRows={displayedRows} 
            filters={filters} 
            tableType="authors"
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

