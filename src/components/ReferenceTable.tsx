import { Table } from "./ui/table";
import { TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/table";
export function ReferenceTable({ rows }: { rows: any[] }) {
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="h-screen flex flex-col items-center justify-around text-left py-12 px-12 mx-2 my-2 overflow-y-auto">
      <h1 className="text-2xl mt-4 mb-4 pb-4 border-border border-b text-muted-foreground font-semibold">
        References
      </h1>
      <Table className="h-full" style={{ tableLayout: 'auto' }}>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-[4rem]">No.</TableHead>
            <TableHead className="max-w-[18rem] whitespace-normal">Title</TableHead>
            <TableHead className="max-w-[28rem] whitespace-normal">Reference</TableHead>  
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeRows.map((row: any, index: number) => {
            const rowKey = row.id ?? index;
            return (
              <TableRow key={rowKey}>
                <TableCell className="max-w-[4rem]">{index + 1}</TableCell>
                <TableCell className="max-w-[18rem] whitespace-normal break-words">{row.ti}</TableCell>
                <TableCell className="max-w-[28rem] whitespace-normal break-words">{row.ref}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
