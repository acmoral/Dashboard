export function AcercaDe() {
  return (
    <div className="h-screen flex flex-col items-center justify-around text-center py-12 px-12 mx-2 my-2 overflow-y-auto">
      <h1 className="text-2xl mt-4 mb-4 pb-4 border-border border-b font-semibold">
        Scoping review for the identification and characterization of authors, research groups, and secondary-use databases in the field of Pharmacoepidemiology in Colombia, Ecuador, and Chile
      </h1>

      {/* Authors list */}
      <h2 className="mt-6 text-xl font-semibold ">
        Authors of this work:
      </h2>
      <ul className="mt-4 mb-4 pb-4 text-sm text-muted-foreground w-full list-disc list-inside border-border border-b">
        <li>
          <a
            className="underline"
            href="mailto:jdvivasb@unal.edu.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jairo Duván Vivas (Main researcher)
          </a>
          - GETS Group, Universidad Nacional de Colombia. Bogotá, Colombia.
        </li>
        <li>
          <a
            className="underline"
            href="https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Durán%2C%20Carlos%20E.%22&l=list&p=1&s=10&sort=bestmatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Durán, Carlos E. (Main researcher)
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
            Mena Ayala, María Belén (Expert advisor)
          </a>
          – Central University of Ecuador
        </li>
        <li>
          <a
            className="underline"
            href="https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Vaca%20González%2C%20Claudia%20Patricia%22&l=list&p=1&s=10&sort=bestmatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vaca González, Claudia Patricia (Senior researcher and expert advisor)
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
            Gaitan, Hernando (Senior researcher and methodological expert advisor)
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
            Vahos Zambrano, Juanita (Main researcher)
          </a>
          – Universidad Nacional de Colombia
        </li>
        <li>
          José Ricardo Ramirez (Junior researcher)
          – Center for Thought on Medicines, Information and Power, Universidad Nacional de Colombia. Bogotá, Colombia.
        </li>
        <li>
          Sebastian Castaño Duque (Expert in literature review and systematic reviews)
          – Independent researcher, Bogotá, Colombia.
        </li>
        <li>
          Jorge Machado Alba (Expert advisor)
          – Research Group in Pharmacoepidemiology and Pharmacovigilance, Technological University of Pereira. Pereira, Colombia.
        </li>
      </ul>

      {/* Project description */}
      <h2 className="mt-6 text-xl font-semibold ">
        Project description:
      </h2>
      <p className="mt-4 text-lg  max-w-md mx-auto border-border border-b pb-4 mb-4">
        The purpose of this scoping review is to explore the resources that have been used and are currently available for conducting pharmacoepidemiological research in Chile, Colombia, and Ecuador. Resources are understood as the different researchers and data sources. The objective is to identify the current state of the field and develop an open-access repository of researchers, groups, and databases. This information will provide a starting point for collaborative pharmacoepidemiological studies using multiple data sources.
      </p>

      {/* Website description */}
      <h2 className="mt-6 text-xl font-semibold">
        Website description:
      </h2>
      <p className="mt-4 text-lg max-w-md mx-auto">
        This website aims to present the results of the scoping review and provide access to the collected information on researchers, groups, and databases in the field of pharmacoepidemiology in Chile, Colombia, and Ecuador.
      </p>
    </div>
  );
}