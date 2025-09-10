import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { CountrySection } from './components/CountrySection';
import { AuthorsTable } from './components/AuthorsTable';

export default function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAuthors, setActiveAuthors] = useState('all');
  const [activeTopics, setActiveTopics] = useState('all');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const handleAuthorFilterChange = (filter: string) => {
    setActiveAuthors(filter);
  };
  const handleTopicFilterChange = (filter: string) => {
    setActiveTopics(filter);
  };  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} activeTab={activeTab} onItemClick={handleItemClick} onTabClick={handleTabChange} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader activeAuthors={activeAuthors} activeTopics={activeTopics} onAuthorFilterChange={handleAuthorFilterChange} onTopicFilterChange={handleTopicFilterChange} />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activeTab === 'dashboard' ? (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <StatsCards />
                
                {/* Charts Section */}
                <Charts />
                
                {/* Countries Section */}
                <CountrySection />
              </div>
            ) : activeTab === 'Tabla de datos' ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-muted-foreground">
                  Tabla de datos
                </h2>
                <AuthorsTable />
              </div>
            ):
            activeTab === 'acerca' ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-muted-foreground">
                  Acerca de
                </h2>
                <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
                  Esta aplicación ha sido desarrollada por el Centro de Pensamiento Medicamentos, Información y Poder (CEMIP) de la Universidad Nacional de Colombia (UNAL).
                </p>
              </div>
            ) : null  
            }
          </div>
        </div>
      </div>
    </div>
  );
}