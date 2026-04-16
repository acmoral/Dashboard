type FilterLocation = "sidebar" | "table" | "map";

type ColumnConfigItem = {
  label: string;
  visible: boolean;
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

  ref: { label: "Reference", visible: false, filter: false },

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
    async: true, // 👈 único async
  },

  dom: {
    label: "Dominio de estudio",
    visible: true,
    filter: true,
    locationofFilter:'sidebar'
  },

  design: {
    label: "Diseño del estudio",
    visible: true,
    filter: true,
    locationofFilter:'sidebar'
  },

  dis: {
    label: "Enfermedad",
    visible: true,
    filter: true,
    locationofFilter:'table'
  },

  drug: {
    label: "Medicamento",
    visible: true,
    filter: true,
    locationofFilter:'table'
  },

  ds_num: {
    label: "# de fuentes de datos",
    visible: true,
    filter: false,
    locationofFilter:'sidebar'
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
    locationofFilter:'sidebar',
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
    locationofFilter:'sidebar',
    format: (v: string) => v.split(";").join(", "),
  },

  ds_con: {
    label: "Pais de la fuente de datos",
    visible: true,
    filter: true,
    locationofFilter:'sidebar',
    format: (v: string) => v.split(";").join(", "),
  },
};