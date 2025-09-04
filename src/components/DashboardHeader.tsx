import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar, ArrowRight, MoreHorizontal } from "lucide-react";

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="bg-white border-b border-border">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Resultados de la extracción</h1>
        
        {/* Tabs and Date Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            <Button
              variant={activeTab === 'resumen' ? 'default' : 'ghost'}
              onClick={() => onTabChange('resumen')}
              className="px-4 py-2"
            >
              Resumen
            </Button>
            <Button
              variant={activeTab === 'base-datos' ? 'default' : 'ghost'}
              onClick={() => onTabChange('base-datos')}
              className="px-4 py-2"
            >
              Base de datos
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">
                Fecha inicial
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40 bg-input-background border-0"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-muted-foreground" />

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">
                Fecha final
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40 bg-input-background border-0"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}