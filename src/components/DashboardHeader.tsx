"use client"; 
import { useState } from 'react';
import { Input } from "./ui/input";
import { Search } from "lucide-react";
interface DashboardHeaderProps {
  availableTopics: string[];
  activeTopics: string;
  onAuthorFilterChange: (filter: string) => void;
  onTopicFilterChange: (filter: string) => void;

}

export function DashboardHeader({ activeTopics,onTopicFilterChange }: DashboardHeaderProps) {


  return (
    <div className="bg-white border-b border-border">
      <div className="p-6">
        <h1 className="sm:text-xl md:text-xl lg:text-xl xxl:text-3xl font-semibold mb-6">Resultados de la extracción</h1>
      </div>
    </div>
  );
}