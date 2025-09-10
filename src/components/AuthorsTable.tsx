import {fetchDatabase} from "./FetchDatabase";
import { useEffect,useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function AuthorsTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDatabase();
      setRows(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Datos crudos</h3>
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHeader>
          <TableRow>
            {rows[0] && Object.keys(rows[0]).map((key) => (
              <TableHead className="text-left w-64 truncate" key={key}>{key}</TableHead>
            )) }
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={index}>
              {Object.entries(row).map(([key, value]) => (
                <TableCell className="text-left w-64 truncate" key={key}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}