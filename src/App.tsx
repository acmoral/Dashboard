import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { CountrySection } from './components/CountrySection';
import { AuthorsTable } from './components/AuthorsTable';
import {fetchDatabase} from "./components/FetchDatabase";
import { filterTableCountriesByAuthors } from './components/filterTableCountriesByAuthors';
import { filterTableTipoAtencion } from './components/filterTableTipoAtencion';
import { filterTableTipoDom } from './components/filterTableDominioPregunta';
import { filterTableDesign } from './components/filterTableDesign';
import { filterTableTipoDisease } from './components/filterTableDisease';
import { AcercaDe } from './components/AcercaDe';
import { useEffect } from 'react';
export default function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAuthors, setActiveAuthors] = useState([] as string[]);
  const [activeTopics, setActiveTopics] = useState('all');
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<{ name: string; code: string; count: number; percentage?: number }[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<{ name: string; code: string; count: number; percentage?: number }[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [tipoAtencion, setTipoAtencion] = useState<{ name: string; value: number; color: string }[]>([]);
  const [tipoDominio, setTipoDominio] = useState<{ name: string; value: number; color: string }[]>([]);
  const [tipoDesign, setTipoDesign] = useState<{ name: string; value: number; color: string }[]>([]);
  const [tipoDisease, setTipoDisease] = useState<{ name: string; value: number; color: string }[]>([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDatabase();
      setRows(data);
      const authors = Array.from(new Set(data.map((item: any) => item.inv_cor).filter(Boolean)));
      const topics = Array.from(new Set(data.map((item: any) => item.Topic).filter(Boolean)));
      setAvailableAuthors(authors);
      setAvailableTopics(topics);
    };
    fetchData();
  }, []);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  useEffect(() => {
    
    const run = async () => {
    const uniqueCountryCounts = await filterTableCountriesByAuthors(availableCountries, activeAuthors as string[], rows);
    setAvailableCountries(uniqueCountryCounts);
    setSelectedCountries(uniqueCountryCounts);
  };
  run();
}, [activeAuthors,rows]);
useEffect(() => {
  const run = async () => {
    const tipoAtencionData = await filterTableTipoAtencion(rows, activeAuthors as string[], selectedCountries.map(c => c.name));
    const tipoDominioData = await filterTableTipoDom(rows, activeAuthors as string[], selectedCountries.map(c => c.name));
    const tipoDesignData = await filterTableDesign(rows, activeAuthors as string[], selectedCountries.map(c => c.name));
    const tipoDiseaseData = await filterTableTipoDisease(rows, activeAuthors as string[], selectedCountries.map(c => c.name));

    setTipoDisease(tipoDiseaseData);
    setTipoDominio(tipoDominioData);
    setTipoAtencion(tipoAtencionData);
    setTipoDesign(tipoDesignData);
  };
  run();
}, [rows, selectedCountries]);
useEffect(() => {
  console.log("Tipo de atención data:", tipoAtencion);
}, [tipoAtencion]);
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
      <Sidebar activeItem={activeItem} activeTab={activeTab} activeAuthors={activeAuthors} availableAuthors={availableAuthors} availableTopics={availableTopics} onAuthorFilterChange={handleAuthorFilterChange} onTopicFilterChange={handleTopicFilterChange} onItemClick={handleItemClick} onTabClick={handleTabChange} />

      {/* Main Content */}
      <div className="sm:bg-red h-full w-full grid grid-rows-[30%_70%]">
        {/* Header */}
        
        {/* Content */}
        <div className=" overflow-hidden">
          <div className="w-full h-full">
            {activeTab === 'dashboard' ? (
              <div className="h-full  sm:flex sm:gap-4 sm:overflow-y:auto sm:flex-col md:overflow-y:auto md:grid md:gap-4 lg:grid lg:grid-cols-5 lg:grid-rows-7 xl:grid xl:grid-cols-5 xl:grid-rows-7  gap-4 p-3">
                {/* Statistics Cards */}
                <div className="sm:flex sm:justify-center lg:col-span-5 xl:col-span-5  w-full ">
                  <StatsCards />
                </div>

                <div className="sm:flex-1 md:row-span-9 md:row-start-2 lg:col-start-1 lg:col-span-3 xl:col-start-1 xl:col-span-3">
                  <Charts tipoAtencion={tipoAtencion} tipoDominio={tipoDominio} tipoDesign={tipoDesign} tipoDisease={tipoDisease} />
                </div>

                <div className="sm:flex sm:flex-col lg:col-span-2 lg:row-span-7 lg:col-start-3 lg:row-start-2 xl:col-span-2 xl:row-span-9 xl:col-start-4 xl:row-start-2">
                  <CountrySection activeAuthors={activeAuthors} rows={rows} availableCountries={availableCountries} selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />
                </div>
              </div>
            ) : activeTab === 'Tabla de datos' ? (
              <div className="p-6 h-full flex flex-col overflow-y-auto text-center py-12">
                <h2 className="sm:text-lg md:text-xl lg:text-xl xxl:text-3xl flex justify-center font-semibold text-muted-foreground">
                  Tabla de datos
                </h2>
               
                <div className="flex-1 overflow-y-auto mt-6">
                  <AuthorsTable  rows={rows} setRows={setRows} activeAuthors={activeAuthors} selectedCountries={selectedCountries} />
                </div>
              </div>
            ):
            activeTab === 'acerca' ? (
              <AcercaDe />
            ) : null
            }
          </div>
        </div>
      </div>
    </div>
  );
}