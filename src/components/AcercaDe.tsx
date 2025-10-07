export function AcercaDe() {
  return (
    <div className="h-screen flex flex-col items-center justify-around text-center py-12 px-12 mx-2 my-2 overflow-y-auto">
      <h1 className="text-2xl mt-4 mb-4 pb-4 border-border border-b text-muted-foreground font-semibold">
        Revisión de alcance para la identificación y caracterización de autores, grupos de investigación y bases datos de uso secundario en el área de la Farmacoepidemiología en Colombia, Ecuador y Chile
      </h1>

      {/* Lista de autores */}
      <h2 className="mt-6 text-xl font-semibold text-muted-foreground">
        Autores de este trabajo:
      </h2>
      <ul className="mt-4 mb-4 pb-4 text-lg text-muted-foreground w-full list-disc list-inside border-border border-b">
        <li>
          <a
            className="underline"
            href="https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Durán%2C%20Carlos%20E.%22&l=list&p=1&s=10&sort=bestmatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Durán, Carlos E. (Researcher)
          </a>
          – Universidad Nacional de Colombia, University Medical Center Utrecht
        </li>
        <li>
          <a
            className="underline"
            href="https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Mena%20Ayala%2C%20María%20Belén%22&l=list&p=1&s=10&sort=bestmatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mena Ayala, María Belén (Researcher)
          </a>
          – Universidad Central de Ecuador
        </li>
        <li>
          <a
            className="underline"
            href="https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Vaca%20González%2C%20Claudia%20Patricia%22&l=list&p=1&s=10&sort=bestmatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vaca González, Claudia Patricia (Project leader)
          </a>
          – Universidad Nacional de Colombia
        </li>
        <li>
          <a
            className="underline"
            href="https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Gaitan%2C%20Hernando%22&l=list&p=1&s=10&sort=bestmatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gaitan, Hernando (Researcher)
          </a>
          – Universidad Nacional de Colombia
        </li>
        <li>
          <a
            className="underline"
            href="https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Vahos%20Zambrano%2C%20Juanita%22&l=list&p=1&s=10&sort=bestmatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vahos Zambrano, Juanita (Researcher)
          </a>
          – Universidad Nacional de Colombia
        </li>
      </ul>

      {/* Descripción del proyecto */}
      <h2 className="mt-6 text-xl font-semibold text-muted-foreground ">
        Descripción del proyecto:
      </h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto border-border border-b pb-4 mb-4">
        El propósito de esta revisión de alcance es explorar los recursos que se han utilizado y están disponibles para realizar investigación farmacoepidemiológica en Chile, Colombia y Ecuador. Se entiende por recursos a los diferentes investigadores y fuentes de datos. El objetivo es conocer el estado actual y desarrollar un repositorio de libre acceso de investigadores, grupos y bases de datos. Esta información proporcionará un punto de partida para estudios fármaco epidemiológicos colaborativos de múltiples fuentes de datos.
      </p>
    {/* Descripción de la página web */}
    <h2 className="mt-6 text-xl font-semibold text-muted-foreground">
      Descripción de la página web:
    </h2>
    <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
      Esta página web tiene como objetivo presentar los resultados de la revisión de alcance y proporcionar acceso a la información recopilada sobre investigadores, grupos y bases de datos en el área de la farmacoepidemiología en Chile, Colombia y Ecuador.
    </p>
    </div>
  );
}
