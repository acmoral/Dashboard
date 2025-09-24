"use client"; 
import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem} from "./ui/dropdown-menu";
import { Calendar, ArrowRight, MoreHorizontal } from "lucide-react";

interface DashboardHeaderProps {
  availableAuthors: string[];
  availableTopics: string[];
  activeAuthors: string[];
  activeTopics: string;
  onAuthorFilterChange: (filter: string) => void;
  onTopicFilterChange: (filter: string) => void;

}

export function DashboardHeader({ activeAuthors, availableAuthors, activeTopics, availableTopics, onAuthorFilterChange, onTopicFilterChange }: DashboardHeaderProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="bg-white border-b border-border">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Resultados de la extracción</h1>
        
        {/* Author, topic and Date Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Author and Topic Filters */}
          <div className="flex items-center gap-4">
             <label className="text-sm text-muted-foreground whitespace-nowrap">
                Autor
              </label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="relative pl-3 pr-8 text-sm bg-input-background border-0">
                      {activeAuthors.length ===  availableAuthors.length || activeAuthors.length === 0 ? 'Todos los autores' : activeAuthors[activeAuthors.length - 1]}
                      <MoreHorizontal className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 z-50">
                    <DropdownMenuCheckboxItem onClick={() => onAuthorFilterChange('all')} className={activeAuthors.length === availableAuthors.length ? "bg-gray-100 font-semibold text-primary" : ""}>Todos los autores</DropdownMenuCheckboxItem>
                    {availableAuthors.map((author) => (
                      <DropdownMenuCheckboxItem key={author} onClick={() => onAuthorFilterChange(author)} className={activeAuthors.includes(author) && activeAuthors.length < availableAuthors.length ? "bg-gray-100 font-semibold text-primary" : ""}>
                        {author}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            <label className="text-sm text-muted-foreground whitespace-nowrap">
                Tema
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar Temas..."
                  className="pl-10 bg-input-background border-0"
                  value={activeTopics}
                  onChange={(e) => onTopicFilterChange(e.target.value)}
                />
              </div>
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