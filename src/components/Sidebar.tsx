import { Search, LayoutDashboard, Info, Database, ListFilter, MoreHorizontal, SquareArrowOutDownRight, Calendar, X } from "lucide-react";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import logo from '../assets/logo.png';
import React, { useState } from "react";


interface SidebarProps {
  activeItem: string;
  activeTab?: string;
  activeAuthors?: string[];
  availableAuthors?: string[];
  onDateFilterChange?: (startDate: string, endDate: string) => void;
  onAuthorFilterChange?: (filter: string) => void;
  onTabClick: (tab: string) => void;
  onItemClick: (item: string) => void;
}
const onButtonClick = (tab: string,item:string, onTabClick: (tab: string) => void, onItemClick: (item: string) => void) => {
  onTabClick(tab);
  onItemClick(item);
};
export function Sidebar({ activeItem, activeTab, activeAuthors = [], availableAuthors = [],  onDateFilterChange, onAuthorFilterChange = () => {}, onTabClick, onItemClick }: SidebarProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isSafari = typeof window !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const handleStartDateChange = (value: string) => {
    if (endDate && value > endDate) {
      alert("La fecha de inicio no puede ser posterior a la fecha de finalización.");
      return;
    }
    setStartDate(value);
    onDateFilterChange?.(value, endDate);

    if (isSafari) {
      setTimeout(() => {
        const el = document.getElementById("start-date") as HTMLInputElement | null;
        el?.blur();
      }, 50);
    }
  };

  const handleEndDateChange = (value: string) => {
    if (value < startDate) {
      alert("La fecha de finalización no puede ser anterior a la fecha de inicio.");
      return;
    }
    setEndDate(value);
    onDateFilterChange?.(startDate, value);

    if (isSafari) {
      setTimeout(() => {
        const el = document.getElementById("end-date") as HTMLInputElement | null;
        el?.blur();
      }, 50);
    }
  };

  const onButtonClick = (tab: string, item: string) => {
    onTabClick(tab);
    onItemClick(item);
  };

  return (
    <div className="w-full max-w-60 bg-white border-r border-border h-full flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex-1 items-center gap-2">
          <div className="w-full rounded flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full" />
          </div>
          <div className="mt-2 space-y-0.5 bg-gray-100 p-2 rounded">
            <div className="text-muted-foreground text-center text-sm">CENTRO DE PENSAMIENTO</div>
            <div className="font-medium text-center text-sm">MEDICAMENTOS</div>
            <div className="text-muted-foreground text-center text-sm">INFORMACIÓN Y PODER</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2 border-b border-border">
          <div className="items-center flex">
            <SquareArrowOutDownRight className="w-5 h-5 inline mr-2" />
            <h2 className="text-lg font-semibold mb-2">Navegación</h2>
          </div>

          <div className="space-y-2">
            <Button variant={activeItem === 'dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onButtonClick('dashboard', 'dashboard')}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>

            <Button variant={activeItem === 'acerca' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onButtonClick('acerca', 'acerca')}>
              <Info className="w-4 h-4 mr-2" />
              Acerca de
            </Button>

            <Button variant={activeItem === 'Tabla de datos' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onButtonClick('Tabla de datos', 'Tabla de datos')}>
              <Database className="w-4 h-4 mr-2" />
              Tabla de datos
            </Button>
          </div>
        </div>

        <div className="py-4 space-y-2 border-b border-border">
          <div className="items-center flex">
            <ListFilter className="w-5 h-5 inline mr-2" />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>

          <div className="w-full justify-start gap-2 flex flex-col">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Autor</label>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="w-full text-sm bg-input-background border-0 whitespace-normal overflow-hidden text-ellipsis text-left justify-between">
                    {activeAuthors.length === availableAuthors.length || activeAuthors.length === 0 ? 'Todos los autores' : activeAuthors[activeAuthors.length - 1]}
                    <MoreHorizontal className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-full max-w-60 overflow-auto text-ellipsis whitespace-nowrap text-left text-sm font-normal">
                  <DropdownMenuCheckboxItem onClick={() => onAuthorFilterChange('all')} className={activeAuthors.length === availableAuthors.length ? "bg-gray-100 font-normal" : "font-normal"}>Todos los autores</DropdownMenuCheckboxItem>
                  {availableAuthors.map((author) => (
                    <DropdownMenuCheckboxItem key={author} onClick={() => onAuthorFilterChange(author)} className={activeAuthors.includes(author) && activeAuthors.length < availableAuthors.length ? "bg-gray-100 font-normal" : "font-normal"}>
                      {author}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Rango de fechas</label>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Fecha inicio</label>
              <div className="relative w-full">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate || ""}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full bg-input-background pr-10 text-left rounded-md"
                />

                <Button type="button" variant="ghost" size="icon" onClick={() => (document.getElementById('start-date') as HTMLInputElement | null)?.showPicker?.()} className="absolute right-3 top-1/2 -translate-y-1/2 p-0 w-9 h-9">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Fecha final</label>
              <div className="relative w-full ">
                <Input
                  id="end-date"
                  type="date"
                  value={endDate || ""}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full bg-input-background pr-10 text-left rounded-md"
                />

                <Button type="button" variant="ghost" size="icon" onClick={() => (document.getElementById('end-date') as HTMLInputElement | null)?.showPicker?.()} className="absolute right-3 top-1/2 -translate-y-1/2 p-0 w-9 h-9">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {(startDate && endDate) ? (
              <div className="relative w-full">
                <Button type="button" variant="ghost" size="icon" onClick={() => {setStartDate(""); setEndDate(""); onDateFilterChange({ startDate: null, endDate: null }); }} className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                  {`${new Date(startDate).toLocaleDateString('en-US')} - ${new Date(endDate).toLocaleDateString('en-US')}`}
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  );
}