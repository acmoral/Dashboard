import { Search, LayoutDashboard, Info, ListFilter, MoreHorizontal, SquareArrowOutDownRight, FilterIcon } from "lucide-react";
import { Button } from "./ui/button";
import logo from '../assets/logo.png';
import {SearchBar} from "./searchBar";
import { columnConfig } from "./configTable";
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
export function Sidebar({ navigation: { activeItem,onTabClick, onItemClick }, 
  filters }: SidebarProps) {
  const filterConfigs: FilterConfig[] = Object.keys(filters).map(key => ({
    key,
    label: columnConfig[key as keyof typeof columnConfig]?.label || key,
    available: filters[key].available,
    active: filters[key].active,
    onChange: filters[key].onChange,
  }));
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
           </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="items-center flex">
            <ListFilter className="w-5 h-5 inline mr-2" />
            <h2 className="text-lg font-semibold mb-2">Filtros de busqueda</h2>
          </div>

         {filterConfigs.map((config) => (
        <div key={config.key} className="space-y-6">
          <SearchBar
            key= {config.key}
            available={config.available}
            active={config.active}
            onFilterChange={config.onChange}
            nombreVariable={config.label}
          />

          {config.active.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 px-1">
            {config.active.map((item) => (
              <Button
                key={item}
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={() => config.onChange(item)} // toggle/remove
              >
                {item}
                <span className="ml-1">×</span>
              </Button>
            ))}
          </div>
        )}
        </div>
      ))}
        </div>
      </nav>
    </div>
  );
}