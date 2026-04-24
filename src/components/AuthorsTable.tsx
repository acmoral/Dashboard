import { Card } from "./ui/card";
import { columnConfig } from "./configTable";
import {TableGen} from "./TableGen";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
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
function getVisibleColumns(data: any[], whereToShow: 'authors' | 'databases' = 'authors'): (keyof ColumnConfig)[] {
  if (data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.filter(
    key => columnConfig[key as keyof ColumnConfig]?.visible === whereToShow
  ) as (keyof ColumnConfig)[];
}

export function AuthorsTable({ filteredRows, filters }: AuthorsTableProps) {
  const visibleColumnsDatabases = getVisibleColumns(filteredRows, 'databases');
  const visibleColumnsAuthors = getVisibleColumns(filteredRows, 'authors');

  return (
    <Card className="h-full overflow-y-auto lg:row-span-4 p-4">
      
      <Tabs defaultValue="authors" className="w-full">
        <TabsList >
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="databases">Databases</TabsTrigger>
        </TabsList>
        <TabsContent value="databases">
          <TableGen visibleColumns={visibleColumnsDatabases} filteredRows={filteredRows} filters={filters} />
        </TabsContent>

        <TabsContent value="authors">

          <TableGen visibleColumns={visibleColumnsAuthors} filteredRows={filteredRows} filters={filters} />
        </TabsContent>
      </Tabs>

    </Card>
  );
}

