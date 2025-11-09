import { Search, LayoutDashboard, Info, ChevronDown,Database,ListFilter,MoreHorizontal,SquareArrowOutDownRight,Calendar,Menu} from "lucide-react";
import { Input } from "./ui/input";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import logo from '../assets/logo.png';
import { useState } from "react";

interface SidebarProps {
  activeItem: string;
  activeTab?: string;
  activeAuthors?: string[];
  availableAuthors?: string[];
  availableTopics?: string[];
  onAuthorFilterChange?: (filter: string) => void;
  onTopicFilterChange?: (filter: string) => void;
  onTabClick: (tab: string) => void;
  onItemClick: (item: string) => void;
}
const onButtonClick = (tab: string,item:string, onTabClick: (tab: string) => void, onItemClick: (item: string) => void) => {
  onTabClick(tab);
  onItemClick(item);
};
export function Sidebar({ activeItem, activeTab, activeAuthors, availableAuthors, availableTopics, onAuthorFilterChange, onTabClick, onItemClick }: SidebarProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  return (
    <div className="w-full max-w-60 bg-white border-r border-border h-full flex flex-col overflow-y-auto">
      {/* University Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex-1 items-center gap-2">
          <div className="w-full rounded flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full" />
          </div>
          <div className="mt-2 space-y-0.5 bg-gray-100 p-2 rounded">
            <div className="sm:text-md md:text-md lg:text-md xxl:text-md text-muted-foreground text-center">CENTRO DE PENSAMIENTO</div>
            <div className="sm:text-md md:text-md lg:text-md xxl:text-md font-medium text-center">MEDICAMENTOS</div>
            <div className="sm:text-md md:text-md lg:text-md xxl:text-md text-muted-foreground text-center">INFORMACIÓN Y PODER</div>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 ">
        <div className="space-y-2 border-b border-border">
          <div className="items-center flex">
            <SquareArrowOutDownRight className="w-5 h-5 inline mr-2" />
            <h2 className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg font-semibold mb-2  ">
              Navegación</h2>
          </div>
          {/* Navigation Buttons */}
          <Button
            variant={activeItem === 'dashboard' ? 'secondary' : 'ghost'}
            className="w-full sm:text-lg md:text-lg lg:text-lg xxl:text-lg justify-start"
            onClick={() => onButtonClick('dashboard','dashboard',onTabClick,onItemClick)}
          >
            <LayoutDashboard className=" w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          <Button
            variant={activeItem === 'acerca' ? 'secondary' : 'ghost'}
            className="w-full sm:text-lg md:text-lg lg:text-lg xxl:text-lg justify-start"
            onClick={() => onButtonClick('acerca','acerca',onTabClick,onItemClick)}
          >
            <Info className="w-4 h-4 mr-2" />
            Acerca de
          </Button>
          <Button
            variant={activeItem === 'Tabla de datos' ? 'secondary' : 'ghost'}
            className="w-full sm:text-lg md:text-lg lg:text-lg xxl:text-lg justify-start"
            onClick={() => onButtonClick('Tabla de datos','Tabla de datos',onTabClick,onItemClick)}
          >
            <Database className="w-4 h-4 mr-2" />
            Tabla de datos
          </Button>
        </div>
        <div className="py-4 space-y-2 border-b border-border ">
          <div className="items-center flex">
            <ListFilter className="w-5 h-5 inline mr-2" />
            <h2 className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg font-semibold  ">
              Filtros</h2>
          </div>
          <div className="w-full justify-start gap-2 flex flex-col">
            <label className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg text-muted-foreground whitespace-nowrap">
                Autor
            </label>
              <div className="relative">
                <DropdownMenu className="">
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="w-full text-sm bg-input-background border-0 whitespace-normal overflow-hidden text-ellipsis text-left justify-between">
                      {activeAuthors.length ===  availableAuthors.length || activeAuthors.length === 0 ? 'Todos los autores' : activeAuthors[activeAuthors.length - 1]}
                      <MoreHorizontal className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-full max-w-60 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm font-normal">
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
          <div className="flex flex-col  gap-2">
            <div className="flex flex-col gap-2">
              <label className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg text-muted-foreground whitespace-nowrap">
                Fecha inicial
              </label>
              <div className="relative w-full">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg w-full bg-input-background pr-10 text-left"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("start-date")?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

           {/*  <ArrowRight className="w-4 h-4 text-muted-foreground" /> */}

            <div className="flex flex-col gap-2">
              <label className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg text-muted-foreground whitespace-nowrap">
                Fecha final
              </label>

              <div className="relative w-full">
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="sm:text-lg md:text-lg lg:text-lg xxl:text-lg w-full bg-input-background pr-10 text-left"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("end-date")?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}