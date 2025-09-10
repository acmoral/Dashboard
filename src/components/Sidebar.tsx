import { Search, LayoutDashboard, Info, ChevronDown,Database } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logo from '../assets/logo.png';
interface SidebarProps {
  activeItem: string;
  activeTab?: string;
  onTabClick: (tab: string) => void;
  onItemClick: (item: string) => void;
}
const onButtonClick = (tab: string,item:string, onTabClick: (tab: string) => void, onItemClick: (item: string) => void) => {
  onTabClick(tab);
  onItemClick(item);
};
export function Sidebar({ activeItem, onItemClick, activeTab, onTabClick }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      {/* University Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex-1 items-center gap-2">
          <div className="w-full rounded flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full" />
          </div>
          <div className="mt-2 space-y-0.5 bg-gray-100 p-2 rounded">
            <div className="text-xs text-muted-foreground text-center">CENTRO DE PENSAMIENTO</div>
            <div className="text-xs font-medium text-center">MEDICAMENTOS</div>
            <div className="text-xs text-muted-foreground text-center">INFORMACIÓN Y PODER</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Button
            variant={activeItem === 'dashboard' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onButtonClick('dashboard','dashboard',onTabClick,onItemClick)}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          <Button
            variant={activeItem === 'acerca' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onButtonClick('acerca','acerca',onTabClick,onItemClick)}
          >
            <Info className="w-4 h-4 mr-2" />
            Acerca de
          </Button>
          <Button
            variant={activeItem === 'Tabla de datos' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onButtonClick('Tabla de datos','Tabla de datos',onTabClick,onItemClick)}
          >
            <Database className="w-4 h-4 mr-2" />
            Tabla de datos
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
          >
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2"></div>
              Contactos
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </nav>
    </div>
  );
}