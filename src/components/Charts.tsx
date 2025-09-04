import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card } from "./ui/card";

const accessTypeData = [
  { name: 'Privado', value: 67, color: '#6b7280' },
  { name: 'Público', value: 33, color: '#e5e7eb' }
];

const pathologyData = [
  { name: 'COVID-19', value: 23, percentage: 7, color: '#6b7280' },
  { name: 'Esquizofrenia', value: 234, percentage: 65, color: '#4b5563' },
  { name: 'Insuficiencia Cardiaca', value: 45, percentage: 15, color: '#9ca3af' },
  { name: 'Convulsiones Epilépticas', value: 65, percentage: 3, color: '#d1d5db' },
  { name: 'Otro', value: 4, percentage: 10, color: '#e5e7eb' }
];

const timelineData = [
  { year: '2005', value: 20 },
  { year: '2006', value: 35 },
  { year: '2007', value: 45 },
  { year: '2008', value: 30 },
  { year: '2009', value: 50 },
  { year: '2010', value: 40 },
  { year: '2011', value: 60 },
  { year: '2013', value: 55 },
  { year: '2014', value: 70 },
  { year: '2015', value: 45 },
  { year: '2016', value: 35 },
  { year: '2017', value: 65 }
];

function DonutChart({ data, title, centerText }: { data: any[], title: string, centerText?: string }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">{title}</h3>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
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
            <span className="text-2xl font-semibold">{centerText}</span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
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

function PathologyChart() {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">Patologías principales</h3>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pathologyData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
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
      <div className="mt-4 space-y-2">
        {pathologyData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{item.value}</span>
              <span className="text-xs bg-muted px-2 py-1 rounded">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TimelineChart() {
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
}

export function Charts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <DonutChart 
        data={accessTypeData} 
        title="Tipo de acceso" 
        centerText="67%"
      />
      <DonutChart 
        data={accessTypeData} 
        title="Tipo de acceso"
      />
      <PathologyChart />
      <div className="xl:col-span-2">
        <TimelineChart />
      </div>
    </div>
  );
}