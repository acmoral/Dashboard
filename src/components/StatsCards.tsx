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
    <Card className={`p-4 hover:shadow-md transition-shadow ${variant === 'accent' ? 'bg-accent/50' : ''}`}>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold">{value}</span>
          {percentage && (
            <span className={`text-sm ${showPercentageBadge ? 'bg-muted px-2 py-1 rounded-full' : 'text-muted-foreground'}`}>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total de estudios" 
        value="296" 
        percentage="100%" 
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