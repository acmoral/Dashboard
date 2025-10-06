import { useEffect,useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
interface AuthorsTableProps {
  rows: any[];
  setRows: (rows: any[]) => void;
  activeAuthors: string[];
  selectedCountries?: { name: string; code: string; count: number; percentage?: number }[];
}
export function AuthorsTable({ rows, setRows, activeAuthors, selectedCountries }: AuthorsTableProps) {
  return (
    <div className="p-4">
      <h3 className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg  font-medium mb-4">Datos crudos</h3>
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHeader>
          <TableRow>
            {rows[0] && Object.keys(rows[0]).map((key) => (
              <TableHead className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg  text-left w-64 truncate" key={key}>{key}</TableHead>
            )) }
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => {
            if (activeAuthors.length === 0 || activeAuthors.includes(row.inv_cor) || activeAuthors.some(author => row.inv_nam.split(";").includes(author))) {
              if (selectedCountries && selectedCountries.length > 0) {
                const countryNames = selectedCountries.map(c => c.name);
                if (!countryNames.some(cn => row.inv_con.split(";").includes(cn))) {
                  return null; // Skip this row if its country is not in selectedCountries
                }
              return (
                <TableRow key={index}>
                  {Object.entries(row).map(([key, value]) => (
                    <TableCell className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg  text-left w-64 truncate" key={key}>{value}</TableCell>
                  ))}
                </TableRow>
              );
              } else {
                return null; // Skip rendering if no countries are selected
              } 
            }
            return null;
          })}
        </TableBody>
      </Table>
    </div>
  );
}