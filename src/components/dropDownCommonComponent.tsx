import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import React from "react";

interface DropDownCommonProps {
    available: string[];
    active: string[];
    onFilterChange: (filter: string) => void;
    nombreVariable: string;
}
export function DropDownCommon({ available, active, onFilterChange, nombreVariable}: DropDownCommonProps) {
    return (
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="w-full text-sm bg-input-background border-0 whitespace-normal overflow-hidden text-ellipsis text-left justify-between">
                    {active.length === available.length || active.length === 0 ? nombreVariable : active[active.length - 1]}
                    <MoreHorizontal className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-full max-w-60 overflow-auto text-ellipsis whitespace-nowrap text-left text-sm font-normal">
                  <DropdownMenuCheckboxItem checked={active.length === available.length} onClick={() => onFilterChange('all')} className={active.length === available.length ? "bg-gray-100 font-normal" : "font-normal"}>Sin filtro</DropdownMenuCheckboxItem>
                  {available.map((item) => (
                    <DropdownMenuCheckboxItem key={item} checked={active.includes(item)} onClick={() => onFilterChange(item)} className={active.includes(item) && active.length < available.length ? "bg-gray-100 font-normal" : "font-normal"}>
                      {item}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
    );
}