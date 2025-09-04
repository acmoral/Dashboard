import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { CountrySection } from './components/CountrySection';
import { AuthorsTable } from './components/AuthorsTable';
import MapComponent from './components/mapView'; // Ensure this path is correct

export default function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('resumen');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activeTab === 'resumen' ? (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <StatsCards />
                
                {/* Charts Section */}
                <Charts />
                
                {/* Countries Section */}
                <CountrySection />
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-muted-foreground">
                  Base de datos
                </h2>
                <AuthorsTable />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}