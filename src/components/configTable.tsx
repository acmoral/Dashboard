type FilterLocation = "sidebar" | "table" | "map" | "header";

type ColumnConfigItem = {
  label: string;
  visible: boolean;
  popUp?: boolean;
  filter: boolean;
  locationofFilter?: FilterLocation;
  field?: string;
  async?: boolean;
  format?: (v: string) => string | string[];
} & (
  | { filter: true; locationofFilter: FilterLocation }
  | { filter: false; locationofFilter?: never }
);

export const columnConfig: Record<string, ColumnConfigItem> = {
  id: { label: "ID", visible: false, filter: false },

  ti: { label: "Titulo del estudio", visible: false, filter: false },

  ref: { label: "Reference", visible: false, popUp:true, filter: false },

  ref_aut: { label: "Citation", visible: false, filter: false },

  cor_aut: {
    label: "Autor",
    visible: true,
    filter: true,
    locationofFilter:'table'
  },

  cor_mail: {
    label: "Email",
    visible: true,
    filter: false,
  },

  cor_afil: {
    label: "Afiliación",
    visible: true,
    filter: false,
    format: (v: string) => v.split(";").join(", "),
  },

  con: {
    label: "País del autor",
    visible: false,
    filter: true,
    locationofFilter:'map',
    field: "countryISO",
    async: true, 
  },

  dom: {
    label: "Dominio de estudio",
    visible: false,
    filter: true,
    locationofFilter:'header'
  },

  design: {
    label: "Diseño del estudio",
    visible: true,
    filter: true, 
    locationofFilter:'header'
  },

  dis: {
    label: "Enfermedad",
    visible: true,
    filter: true,
    locationofFilter:'sidebar'
  },

  drug: {
    label: "Medicamento",
    visible: true,
    filter: true,
    locationofFilter:'sidebar'
  },

  ds_num: {
    label: "# de fuentes de datos",
    visible: true,
    filter: false,
    locationofFilter:'header'
  },

  ds_sp: {
    label: "Especificidad de las fuentes de datos",
    visible: false,
    filter: false,
    format: (v: string) => v.split(";"),
  },

  ds_en: {
    label: "Data Sources (EN)",
    visible: false,
    filter: false,
    format: (v: string) => v.split(";").join(", "),
  },

  ds_ty: {
    label: "Tipo de fuente de datos",
    visible: true,
    filter: true,
    locationofFilter:'header',
    format: (v: string) => v.split(";").join(", "),
  },

  ds_gr: {
    label: "Grupo de datos",
    visible: false,
    filter: false,
    format: (v: string) => v.split(";").join(", "),
  },

  ds_adm: {
    label: "Nivel de administración",
    visible: false,
    filter: false,
    format: (v: string) => v.split(";").join(", "),
  },

  ds_reg: {
    label: "Tipo de administración",
    visible: true,
    filter: true,
    locationofFilter:'header',
    format: (v: string) => v.split(";").join(", "),
  },

  ds_con: {
    label: "Pais de la fuente de datos",
    visible: true,
    filter: true,
    locationofFilter:'map',
    async: true,
    format: (v: string) => v.split(";").join(", "),
  },
};