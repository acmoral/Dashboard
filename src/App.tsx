import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { CountrySection } from './components/CountrySection';
import { AuthorsTable } from './components/AuthorsTable';
import {fetchDatabase} from "./components/FetchDatabase";
import { filterTableTipoAtencion } from './components/filterTableTipoAtencion';
import { filterTableTipoDom } from './components/filterTableDominioPregunta';
import { filterTableDesign } from './components/filterTableDesign';
import { filterTableTipoDisease } from './components/filterTableDisease';
import { AcercaDe } from './components/AcercaDe';
import { countryNameToIso } from "./components/countryToiso";
import { filterRowsByCountry } from './components/filterRowsByCountry';
import { filterRowsByAuthor } from './components/filterRowsByAuthor';
import { useEffect } from 'react';
export default function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAuthors, setActiveAuthors] = useState([] as string[]);
  const [activeDates, setActiveDates] = useState<{ startDate: string; endDate: string }>({ startDate: '', endDate: '' });
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [tipoAtencion, setTipoAtencion] = useState<{ name: string; value: number; color: string }[]>([]);
  const [tipoDominio, setTipoDominio] = useState<{ name: string; value: number; color: string }[]>([]);
  const [tipoDesign, setTipoDesign] = useState<{ name: string; value: number; color: string }[]>([]);
  const [tipoDisease, setTipoDisease] = useState<{ name: string; value: number; color: string }[]>([]);
  const [rows, setRows] = useState([]);
  const [filterCountries, setFilterCountries] = useState<string[]>([]);
  const [filteredRows, setFilteredRows] = useState([]);

  // ----------------------------------
  // Fetch initial data
  // ----------------------------------

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDatabase();
      setRows(data);
      setFilteredRows(data);
      const countries = Array.from(new Set(data.map((item: any) => item.inv_con).flatMap((c: string) => c.split(";")).map((c: string) => c.trim()).filter(Boolean)));
      const countriesISOS = await Promise.all(
        countries.map((country) => countryNameToIso(country))
      );
      const uniqueCountriesISOS = Array.from(new Set(countriesISOS.filter(code => code)));
      const authors = Array.from(new Set(data.map((item: any) => item.inv_cor).filter(Boolean)));
      setAvailableAuthors(authors);
      setAvailableCountries(uniqueCountriesISOS);
    };
    fetchData();
  }, []);
  //----------------------------------
  // Handlers
  //----------------------------------
  useEffect(() => {
    const run = async () => {
      const filtered = await filterRowsByCountry(filterCountries, rows);
      const finalFiltered = await filterRowsByAuthor(activeAuthors, filtered);
      const authors = Array.from(new Set(filtered.map((item: any) => item.inv_cor).filter(Boolean)));
      setAvailableAuthors(authors);
      setFilteredRows(finalFiltered);
    };
    run();
  }, [filterCountries, rows]);

  useEffect(() => {
    const run = async () => {
      const filtered = filterRowsByAuthor(activeAuthors, rows);
      const finalFiltered = await filterRowsByCountry(filterCountries, filtered);
      const countries = Array.from(new Set(filtered.map((item: any) => item.inv_con).flatMap((c: string) => c.split(";")).map((c: string) => c.trim()).filter(Boolean)));
      const countriesISOS = await Promise.all(
        countries.map((country) => countryNameToIso(country))
      );
      const uniqueCountriesISOS = Array.from(new Set(countriesISOS.filter(code => code)));
      setAvailableCountries(uniqueCountriesISOS);
      setFilteredRows(finalFiltered);
    };
    run();
  }, [activeAuthors,rows]);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  useEffect(() => {
    console.log("Active countries changed:", filterCountries);
  }, [filterCountries]);
  useEffect(() => {
    console.log("Active authors changed:", activeAuthors);
  }, [activeAuthors]);
  useEffect(() => {
    console.log("Filtered rows changed:", filteredRows);
  }, [filteredRows]);
  useEffect(() => {
    const run = async () => {
      const tipoAtencionData = await filterTableTipoAtencion({filteredRows});
      const tipoDominioData = await filterTableTipoDom({filteredRows});
      const tipoDesignData = await filterTableDesign({filteredRows});
      const tipoDiseaseData = await filterTableTipoDisease({filteredRows});
      setTipoDisease(tipoDiseaseData);
      setTipoDominio(tipoDominioData);
      setTipoAtencion(tipoAtencionData);
      setTipoDesign(tipoDesignData);
    };
    run();
  }, [filteredRows]);
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
  const handleDateFilterChange = (startDate: string, endDate: string) => {
    setActiveDates({ startDate, endDate });
    console.log("Date filter changed in App:", startDate, endDate); 
  };
  return (
    <div className="flex h-svh">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} activeTab={activeTab} activeAuthors={activeAuthors} availableAuthors={availableAuthors}  onDateFilterChange={handleDateFilterChange} onAuthorFilterChange={handleAuthorFilterChange} onItemClick={handleItemClick} onTabClick={handleTabChange} />

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
                  <CountrySection  availableCountries={availableCountries}  filterCountries={filterCountries} filteredRows={filteredRows} setFilterCountries={setFilterCountries} />
                </div>
              </div>
            ) : activeTab === 'Tabla de datos' ? (
              <div className="p-6 h-full flex flex-col overflow-y-auto text-center py-12">
                <h2 className="sm:text-lg md:text-xl lg:text-xl xxl:text-3xl flex justify-center font-semibold text-muted-foreground">
                  Tabla de datos
                </h2>
               
                <div className="flex-1 overflow-y-auto mt-6">
                  <AuthorsTable  filteredRows={filteredRows} />
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