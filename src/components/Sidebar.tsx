import { Search, LayoutDashboard, Info, ListFilter, MoreHorizontal, SquareArrowOutDownRight } from "lucide-react";
import { DropDownCommon } from "./dropDownCommonComponent";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import logo from '../assets/logo.png';
import React, { useState, useEffect } from "react";

type FilterItem = {
  active: string[];
  available: string[];
  onChange: (value: string) => void;
};

interface SidebarProps {
  navigation: {
    activeItem: string;
    onTabClick: (tab: string) => void;
    onItemClick: (item: string) => void;
  };
  filters: Record<string, FilterItem>;
}

type FilterConfig = {
  key: string;
  label: string;
  available: string[];
  active: string[];
  onChange: (value: string) => void;
};
const getLabel = (key: string) => {
  const labels: Record<string, string> = {
    authors: 'Autores',
    design: 'Diseños',
    dominio: 'Dominios',
    disease: 'Enfermedades',
    countries: 'Países',
    drugs: 'Medicamentos',
    dstype: 'Tipo de base de datos',
    dsreg: 'Administración de la base de datos',
    dscon: 'País de la base de datos',
  };

  return labels[key] ?? key;
};
export function Sidebar({ navigation: { activeItem,onTabClick, onItemClick }, 
  filters }: SidebarProps) {
  const filterConfigs: FilterConfig[] = Object.entries(filters).map(
  ([key, filter]) => ({
    key,
    label: getLabel(key),
    ...filter,
  })
);
  const isSafari = typeof window !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);


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
            <Button variant={activeItem === 'Tabla de autores' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onButtonClick('Tabla de autores', 'Tabla de autores')}>
              <ListFilter className="w-4 h-4 mr-2" />
              Tabla de autores
            </Button>
           </div>
        </div>
      </nav>
    </div>
  );
}