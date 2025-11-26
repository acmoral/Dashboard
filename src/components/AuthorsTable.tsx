import { useEffect,useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
interface AuthorsTableProps {
  filteredRows: any[];
}
export function AuthorsTable({ filteredRows}: AuthorsTableProps) {
  return (
    <div className="p-4">
      <h3 className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg  font-medium mb-4">Datos crudos</h3>
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHeader>
          <TableRow>
            {filteredRows[0] && Object.keys(filteredRows[0]).map((key) => (
              <TableHead className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg  text-left w-64 truncate" key={key}>{key}</TableHead>
            )) }
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.map((row: any, index: number) => {
              return (
                <TableRow key={index}>
                  {Object.entries(row).map(([key, value]) => (
                    <TableCell className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg  text-left w-64 truncate" key={key}>{value}</TableCell>
                  ))}
                </TableRow>
              );
          })}
        </TableBody>
      </Table>
    </div>
  );
}