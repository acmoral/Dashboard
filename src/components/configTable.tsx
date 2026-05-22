type FilterLocation = "sidebar" | "table" | "map" | "header";
type VisibleConfig = 'authors' | 'databases' | 'none';
type ColumnConfigItem = {
  label: string;
  visible: VisibleConfig;
  popUp?: boolean;
  filter: boolean;
  locationofFilter?: FilterLocation;
  aggregation?: {
    split: boolean;}
  field?: string;
  async?: boolean;
  format?: (v: string) => string | string[];
} & (
  | { filter: true; locationofFilter: FilterLocation }
  | { filter: false; locationofFilter?: never }
);

export const columnConfig: Record<string, ColumnConfigItem> = {
  id: { label: "ID", visible:'none', filter: false },

  ti: { label: "Paper title", visible: 'none', filter: false },

  ref: { label: "Reference", visible: 'none', popUp:true, filter: false },

  ref_aut: { label: "Citation", visible: 'none', filter: false },

  cor_aut: {
    label: "Author",
    visible: 'authors',
    filter: true,
    aggregation: {split: false},
    locationofFilter:'table',
  },

  cor_mail: {
    label: "Email",
    visible: 'authors',
    filter: false,
    aggregation: {split: true}
  },

  cor_afil: {
    label: "Affiliation",
    visible: 'authors',
    filter: false,
    aggregation: {split: true},
    format: (v: string) => v.split(";").join(", "),
  },

  con: {
    label: "Country of authors",
    visible: 'authors',
    filter: true,
    aggregation: {split: true},
    locationofFilter:'map',
    field: "countryISO",
    async: true, 
  },

  dom: {
    label: "Study domain",
    visible: 'authors',
    filter: true,
    aggregation: {split: true},
    locationofFilter:'header',
    format: (v: string) => v.split(";").join(", "),
  },

  design: {
    label: "Study design",
    visible: 'authors',
    filter: true, 
    aggregation: {split: true},
    locationofFilter:'header',
    format: (v: string) => v.split(";").join(", "),
  },

  dis: {
    label: "Disease",
    visible: 'authors',
    filter: true,
    aggregation: {split: true},
    locationofFilter:'sidebar',
    format: (v: string) => v.split(";").join(", "),
  },

  drug: {
    label: "Drug",
    visible: 'authors',
    filter: true,
    aggregation: {split: true},
    locationofFilter:'sidebar',
    format: (v: string) => v.split(";").join(", "),
  },

  ds_num: {
    label: "# of data sources",
    visible: 'none',
    filter: false,
  },

  ds_sp: {
    label: "Data sources (ES)",
    visible: 'databases',
    filter: false,
    format: (v: string) => v.split(";"),
  },

  ds_en: {
    label: "Data Sources (EN)",
    visible: 'databases',
    filter: true,
    locationofFilter:'sidebar',
    format: (v: string) => v.split(";").join(", "),
  },

  ds_ty: {
    label: "Type of data source",
    visible: 'databases',
    filter: true,
    aggregation: {split: true},
    locationofFilter:'sidebar',
    format: (v: string) => v.split(";").join(", "),
  },

  ds_gr: {
    label: "Data source group",
    visible: 'databases',
    filter: true,
    aggregation: {split: true},
    locationofFilter:'header',
    format: (v: string) => v.split(";").join(", "),
  },

  ds_adm: {
    label: "Level of administration",
    visible: 'databases',
    filter: true,
    locationofFilter:'header',
    aggregation: {split: true},
    format: (v: string) => v.split(";").join(", "),
  },

  ds_reg: {
    label: "Geographical coverage",
    visible: 'databases',
    filter: true,
    aggregation: {split: true},
    locationofFilter:'header',
    format: (v: string) => v.split(";").join(", "),
  },

  ds_con: {
    label: "Country of data source",
    visible: 'databases',
    filter: true,
    aggregation: {split: true},
    locationofFilter:'map',
    async: true,
    format: (v: string) => v.split(";").join(", "),
  },
};