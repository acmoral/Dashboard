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
<Card
  className={`p-2 lg:p-4 xl:p-2 xxl:p-4 hover:shadow-md transition-shadow ${
    variant === 'accent' ? 'bg-accent/50' : ''
  } flex items-center justify-center`}
>
  <div className="flex flex-col items-center justify-center space-y-2">

    <p className="text-xl font-medium text-muted-foreground text-center">
      {title}
    </p>

    <div className="flex items-center space-x-2">
      <span className="text-2xl font-semibold tabular-nums leading-tight text-center">
        {value}
      </span>

      {percentage && (
        <span
          className={`${
            showPercentageBadge
              ? 'bg-muted px-2 py-1 rounded-full text-sm'
              : 'text-muted-foreground text-sm'
          }`}
        >
          {percentage}
        </span>
      )}
    </div>
  </div>
</Card>

  );
}

export function StatsCards({totalEstudios, numberOfActiveAuthors, totaluniqueAuthors, numberOfActiveCountries, totaluniqueCountries, totalNumberEnfermedades, numerodeEnfermedades }: { totalEstudios: number, numberOfActiveAuthors: number, totaluniqueAuthors: number, numberOfActiveCountries: number, totaluniqueCountries: number, totalNumberEnfermedades: number, numerodeEnfermedades: number }) {
  return (
    <div className="h-full lg:grid lg:grid-cols-4 lg:grid-rows-1 sm:flex sm:flex-col md:grid md:grid-cols-2 md:grid-rows-2 lg:gap-4 sm:grid sm:grid-rows-2 sm:grid-cols-2 sm:gap-4 md:gap-4">
{/*       <div className="h-full bg-blue">
        <p>hi</p>
      </div> */}
      <StatCard 
        title="Total de estudios" 
        value={totalEstudios}
      />
      <StatCard 
        title="Autores" 
        value={numberOfActiveAuthors}
        percentage={Math.round(numberOfActiveAuthors/totaluniqueAuthors * 100) + "%"}
        showPercentageBadge 
      />

      <StatCard 
        title="Países" 
        value={numberOfActiveCountries}
        percentage={Math.round(numberOfActiveCountries/totaluniqueCountries * 100) + "%"}
        showPercentageBadge
      />
      <StatCard 
        title="Enfermedades" 
        value={numerodeEnfermedades} 
        percentage={Math.round(numerodeEnfermedades/totalNumberEnfermedades*100)+ "%"}
        variant="default"
      />
    </div>
  );
}