import { Card } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  percentage?: string;
  showPercentageBadge?: boolean;
  variant?: 'default' | 'accent';
}

function StatCard({ title, value, percentage, showPercentageBadge, variant = 'default' }: StatCardProps) {
  return (
    <Card className={`p-2  lg:p-4 xl:p-2 xxl:p-4 hover:shadow-md transition-shadow ${variant === 'accent' ? 'bg-accent/50' : ''}`}>
      <div className="space-y-2">
        <p className="sm:text-2xl md:text-2xl lg:text-xl sl:text-xl xl:text-xl xxl:text-2xl text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="sm:text-2xl md:text-2xl lg:text-xl sl:text-xl xl:text-xl xxl:text-2xl font-semibold">{value}</span>
          {percentage && (
            <span className={`sm:text-xl md:text-xl lg:text-xl sl:text-xl xl:text-xl xxl:text-2xl ${showPercentageBadge ? 'bg-muted px-2 py-1 rounded-full' : 'text-muted-foreground'}`}>
              {percentage}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export function StatsCards() {
  return (
    <div className="h-full lg:grid lg:grid-cols-4 lg:grid-rows-1 sm:flex sm:flex-col md:grid md:grid-cols-2 md:grid-rows-2 lg:gap-4 sm:gap-4 md:gap-4">
{/*       <div className="h-full bg-blue">
        <p>hi</p>
      </div> */}
      <StatCard 
        title="Total de estudios" 
        value="296" 
      />
      <StatCard 
        title="Autores" 
        value="30" 
        percentage="100%" 
        showPercentageBadge 
      />

      <StatCard 
        title="Lugares de afiliación de autores" 
        value="32" 
        percentage="100%" 
      />
      <StatCard 
        title="Otra cifra numérica" 
        value="8K" 
        percentage="+52%" 
        variant="accent"
      />
    </div>
  );
}