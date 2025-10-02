import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { CountrySection } from './components/CountrySection';
import { AuthorsTable } from './components/AuthorsTable';
import {fetchDatabase} from "./components/FetchDatabase";
import { useEffect } from 'react';
export default function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAuthors, setActiveAuthors] = useState([] as string[]);
  const [activeTopics, setActiveTopics] = useState('all');
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDatabase();
      setRows(data);
      const authors = Array.from(new Set(data.map((item: any) => item.inv_cor).filter(Boolean)));
      const topics = Array.from(new Set(data.map((item: any) => item.Topic).filter(Boolean)));
      setAvailableAuthors(authors);
      setAvailableTopics(topics);
      console.log("Fetched authors:", authors);
    };
    fetchData();
  }, []);
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const handleAuthorFilterChange = (filter: string) => {
    if (filter === 'all') {
      setActiveAuthors(availableAuthors);
    } else {
      if (activeAuthors.length === availableAuthors.length) {
        setActiveAuthors([filter]);
        return;
      }
      // Toggle author selection
      if (activeAuthors.includes(filter)) {
        setActiveAuthors(activeAuthors.filter(author => author !== filter));
        return;
      }
      else{
      setActiveAuthors([...activeAuthors, filter]);
    }
    }
  };
  const handleTopicFilterChange = (filter: string) => {
    setActiveTopics(filter);
  };  
  return (
    <div className="flex h-svh">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} activeTab={activeTab} onItemClick={handleItemClick} onTabClick={handleTabChange} />

      {/* Main Content */}
      <div className="h-full w-full grid grid-rows-[30%_70%]">
        {/* Header */}
        <div className="overflow-hidden">
        <DashboardHeader availableAuthors={availableAuthors} availableTopics={availableTopics} activeAuthors={activeAuthors} activeTopics={activeTopics} onAuthorFilterChange={handleAuthorFilterChange} onTopicFilterChange={handleTopicFilterChange} />
        </div>
        {/* Content */}
        <div className=" overflow-hidden">
          <div className="w-full h-full">
            {activeTab === 'dashboard' ? (
              <div className="h-full  sm:flex sm:gap-4 sm:overflow-y:auto sm:flex-col md:overflow-y:auto lg:grid lg:grid-cols-5 lg:grid-rows-7 xl:grid xl:grid-cols-5 xl:grid-rows-7  gap-4 p-4">
                {/* Statistics Cards */}
                <div className="sm:flex sm:justify-center lg:col-span-5 xl:col-span-5  w-full ">
                  <StatsCards />
                </div>

                <div className="sm:flex-1 md:row-span-9 md:row-start-2 lg:col-start-1 lg:col-span-3 xl:col-start-1 xl:col-span-3">
                  <Charts />
                </div>

                <div className="sm:flex sm:flex-col lg:col-span-2 lg:row-span-7 lg:col-start-3 lg:row-start-2 xl:col-span-2 xl:row-span-9 xl:col-start-4 xl:row-start-2">
                  <CountrySection activeAuthors={activeAuthors} rows={rows} />
                </div>
              </div>
            ) : activeTab === 'Tabla de datos' ? (
              <div className="p-6 h-full flex flex-col overflow-y-auto text-center py-12">
                <h2 className="sm:text-xl md:text-xl lg:text-xl xxl:text-3xl flex justify-center font-semibold text-muted-foreground">
                  Tabla de datos
                </h2>
               
                <div className="flex-1 overflow-y-auto mt-6">
                  <AuthorsTable  rows={rows} setRows={setRows} activeAuthors={activeAuthors} />
                </div>
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