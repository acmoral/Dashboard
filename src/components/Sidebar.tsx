import { Search, LayoutDashboard, Info, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      {/* University Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">UNIVERSIDAD</div>
            <div className="text-xs font-medium">NACIONAL</div>
            <div className="text-xs text-muted-foreground">DE COLOMBIA</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Buscar..." 
            className="pl-10 bg-input-background border-0"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Button
            variant={activeItem === 'dashboard' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onItemClick('dashboard')}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          <Button
            variant={activeItem === 'acerca' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onItemClick('acerca')}
          >
            <Info className="w-4 h-4 mr-2" />
            Acerca de
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