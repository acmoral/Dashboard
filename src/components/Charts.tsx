import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card } from "./ui/card";

const accessTypeData = [
  { name: 'Privado', value: 67, color: 'var(--chart-1)' },
  { name: 'Público', value: 33, color: 'var(--chart-2)' }
];

const pathologyData = [
  { name: 'COVID-19', value: 23, percentage: 7, color: 'var(--chart-3)' },
  { name: 'Esquizofrenia', value: 234, percentage: 65, color: 'var(--chart-4)' },
  { name: 'Insuficiencia Cardiaca', value: 45, percentage: 15, color: 'var(--chart-5)' },
  { name: 'Convulsiones Epilépticas', value: 65, percentage: 3, color: 'var(--chart-6)' },
  { name: 'Otro', value: 4, percentage: 10, color: 'var(--chart-7)' }
];


function DonutChart({ data, title, centerText,className }: { data: any[], title: string, centerText?: string, className?: string }) {
  return (
    <Card className={`p-3 ${className}`}>
      <h3 className="text-base font-medium mb-3">{title}</h3>
      <div className="relative h-48">
              {data.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <span className="text-sm text-muted-foreground">No hay datos con este filtro</span>
        </div>
      ) : null}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={"60%"}
              outerRadius={"100%"}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold">{centerText}</span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2 overflow-y-auto max-h-32">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* function TimelineChart() {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">Línea temporal</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timelineData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="year" type="category" />
            <Bar dataKey="value" fill="#9ca3af" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} */

export function Charts({ tipoAtencion, tipoDominio, tipoDesign, tipoDisease }: { tipoAtencion: { name: string; value: number; color: string }[]; tipoDominio: { name: string; value: number; color: string }[]; tipoDesign: { name: string; value: number; color: string }[]; tipoDisease: { name: string; value: number; color: string }[] }) {
  return (
    <div className="h-full md:grid md:grid-cols-2 md:grid-rows-2 md:gap-4 md:auto-rows-fr sm:flex sm:flex-col sm:gap-4 ">
      <DonutChart
        data={tipoAtencion}
        title="Tipo de atención"
        /* centerText="296" */
        className="col-span-1 row-span-1"
      />
      <DonutChart 
        data={tipoDominio}
        title="Tipo de dominio de pregunta"
        className="col-span-1 row-span-1 col-start-2 row-start-1"
      />
      <DonutChart 
        data={tipoDesign}
        title="Tipo de diseño de estudio"
        className="col-span-1 row-span-1 row-start-2 col-start-2"
      />
      <DonutChart 
        data={tipoDisease}
        title="Tipo de enfermedad"
        className="col-span-1 row-span-1 row-start-2 col-start-1"
      />
    </div>
  );
}