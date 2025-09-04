import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
interface Author {
  name: string;
  publications: number;
  citations: number;
  hIndex: number;
}

const authors: Author[] = [
  { name: 'Juan Pérez', publications: 50, citations: 1200, hIndex: 20 },
  { name: 'María Gómez', publications: 40, citations: 900, hIndex: 18 },
  { name: 'Carlos Rodríguez', publications: 30, citations: 700, hIndex: 15 },
];

export function AuthorsTable() {
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Autores Destacados</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Publicaciones</TableHead>
            <TableHead>Citas</TableHead>
            <TableHead>Índice h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.map((author) => (
            <TableRow key={author.name}>
              <TableCell>{author.name}</TableCell>
              <TableCell>{author.publications}</TableCell>
              <TableCell>{author.citations}</TableCell>
              <TableCell>{author.hIndex}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}