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
    <Card className={`p-3 xxl:p-6 ${className}`}>
      <h3 className="sm:text-xl md:text-xl lg:text-xl xxl:text-2xl font-medium mb-3">{title}</h3>
      <div className="relative h-48">
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
            <span className="sm:text-2xl font-semibold">{centerText}</span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2 overflow-y-auto max-h-32">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between sm:text-md md:text-2xl lg:text-xl">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.name}</span>
            </div>
            <span className="text-muted-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PathologyChart({className}: {className?: string}) {
  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="sm:text-xl md:text-xl font-medium mb-4">Patologías principales</h3>
      <div className="relative h-48">
        <ResponsiveContainer width="90%" height="90%">
          <PieChart>
            <Pie
              data={pathologyData}
              cx="50%"
              cy="50%"
              innerRadius={"40%"}
              outerRadius={"100%"}
              paddingAngle={2}
              dataKey="value"
            >
              {pathologyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2 overflow-y-auto max-h-32">
        {pathologyData.map((item, index) => (
          <div key={index} className="flex items-center justify-between sm:text-md md:text-xl">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{item.value}</span>
              <span className="sm:text-md md:text-md bg-muted px-2 py-1 rounded">{item.percentage}%</span>
            </div>
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

export function Charts({ tipoAtencion }: { tipoAtencion: { name: string; value: number; color: string }[] }) {
  return (
    <div className="h-full md:grid md:grid-cols-2 md:grid-rows-2 md:gap-4 md:auto-rows-fr sm:flex sm:flex-col sm:gap-4 p-4">
      <DonutChart
        data={tipoAtencion}
        title="Tipo de atención"
        /* centerText="296" */
        className="col-span-1 row-span-1 "
      />
      <DonutChart 
        data={accessTypeData} 
        title="Tipo de acceso"
        className="col-span-1 row-span-1 col-start-2 row-start-1"
      />
      <DonutChart 
        data={accessTypeData} 
        title="Tipo de acceso"
        className="col-span-1 row-span-1 row-start-2 col-start-2"
      />
      <PathologyChart className="col-span-1 row-span-1 row-start-2 col-start-1" />
      <div className="xl:col-span-2">
      </div>
    </div>
  );
}