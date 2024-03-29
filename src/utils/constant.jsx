export const HEIGHT_NAVIGATION_MOBILE = 70;

export const MOVIE_CARD_WIDTH = 150;
export const MOVIE_CARD_HEIGHT = 230;

export const MOVIE_CARD_WIDTH_DATA_GRID = 70;
export const MOVIE_CARD_HEIGHT_DATA_GRID = 100;

export const MOVIE_CARD_WIDTH_MOBILE = 100;
export const MOVIE_CARD_HEIGTH_MOBILE = 150;

export const MOVIE_PAGE_CARD_WIDTH = 175;
export const MOVIE_PAGE_CARD_HEIGHT = 255;

export const PERSON_DETAIL_WIDTH = 175;
export const PERSON_DETAIL_HEIGHT = 255;

export const PERSON_DETAIL_WIDTH_MOBILE = 125;
export const PERSON_DETAIL_HEIGHT_MOBILE = 185;

export const MOVIE_PAGE_CARD_WIDTH_MOBILE = 125;
export const MOVIE_PAGE_CARD_HEIGTH_MOBILE = 185;

export const EPISODE_CARD_WIDTH = 180;
export const EPISODE_CARD_HEIGHT = 130;
export const EPISODE_CARD_WIDTH_MOBILE = 110;
export const EPISODE_CARD_HEIGHT_MOBILE = 90;

export const EPISODE_CARD_DETAIL_WIDTH = 220;
export const EPISODE_CARD_DETAIL_HEIGHT = 130;

export const MINI_MOVIE_CARD_WIDTH = 60;
export const MINI_MOVIE_CARD_HEIGTH = 85;

export const MAX_CAST_VISUALIZATION = 4;

export const MAX_IMAGE_VISUALIZATION = 6;

export const KEYWORDS_SEARCH_MOVIE = [
  {
    label: "Film Fantascientifici",
    name: "science_movie",
    queries: [
      {
        id: 310,
        name: "artificial intelligence",
      },
      {
        id: 1432,
        name: "nasa",
      },
      {
        id: 1521,
        name: "time warp",
      },
      {
        id: 1612,
        name: "spacecraft",
      },

      {
        id: 2964,
        name: "future",
      },

      {
        id: 3801,
        name: "space travel",
      },

      {
        id: 4380,
        name: "black hole",
      },
      {
        id: 4565,
        name: "dystopia",
      },
      {
        id: 4776,
        name: "race against time",
      },
      {
        id: 8056,
        name: "quantum mechanics",
      },
      {
        id: 9882,
        name: "space",
      },

      {
        id: 14760,
        name: "scientist",
      },

      {
        id: 195114,
        name: "space adventure",
      },
    ],
  },
  {
    label: "Film Horror divertenti",
    name: "horor_comedy",
    queries: [
      {
        id: 224636,
        name: "horror comedy",
      },
      {
        id: 12416,
        name: "horror spoof",
      },

      {
        id: 249969,
        name: "horror parody",
      },
    ],
  },
  {
    label: "Film basati su storie vere",
    name: "true_story",
    queries: [
      {
        id: 272581,
        name: "true story",
      },
      {
        id: 9672,
        name: "based on true story",
      },
      {
        id: 231069,
        name: "inspired by true story",
      },
      {
        id: 318778,
        name: "inspired by a true story",
      },
    ],
  },
  {
    label: "Film violenti",
    name: "violence_movie",
    queries: [
      {
        id: 312898,
        name: "violence",
      },
      {
        id: 280044,
        name: "violence against animals",
      },
      {
        id: 281523,
        name: "gender violence",
      },
      {
        id: 286646,
        name: "brutal violence",
      },
      {
        id: 181858,
        name: "gang violence",
      },
      {
        id: 291725,
        name: "pinky violence",
      },
      {
        id: 5927,
        name: "violence against women",
      },
      {
        id: 163656,
        name: "gun violence",
      },
      {
        id: 262404,
        name: "extreme violence",
      },
      {
        id: 296359,
        name: "graphic violence",
      },
      {
        id: 310672,
        name: "violence action",
      },
      {
        id: 311371,
        name: "psychological violence",
      },
    ],
  },
  {
    label: "Film Coreani",
    name: "korean_movie",
    queries: [
      {
        id: 261681,
        name: "south-korea",
      },
      {
        id: 260672,
        name: "korean",
      },
    ],
  },
];

export const DEPARTMENT_PERSONS = {
  Acting: "Recitazione",
  Directing: "Direzione",
  Production: "Produzione",
  Writing: "Scrittura",
};

export const GRID_DEFAULT_LOCALE_ITALIAN_TEXT = {
  // Root
  noRowsLabel: "Nessuna riga",
  noResultsOverlayLabel: "Nessun risultato trovato.",

  // Density selector toolbar button text
  toolbarDensity: "Densità",
  toolbarDensityLabel: "Densità",
  toolbarDensityCompact: "Compatto",
  toolbarDensityStandard: "Standard",
  toolbarDensityComfortable: "Comodo",

  // Columns selector toolbar button text
  toolbarColumns: "Colonne",
  toolbarColumnsLabel: "Seleziona colonne",

  // Filters toolbar button text
  toolbarFilters: "Filtri",
  toolbarFiltersLabel: "Mostra filtri",
  toolbarFiltersTooltipHide: "Nascondi filtri",
  toolbarFiltersTooltipShow: "Mostra filtri",
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtri attivi` : `${count} filtro attivo`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: "Cerca...",
  toolbarQuickFilterLabel: "Cerca",
  toolbarQuickFilterDeleteIconLabel: "Cancella",

  // Export selector toolbar button text
  toolbarExport: "Esporta",
  toolbarExportLabel: "Esporta",
  toolbarExportCSV: "Scarica come CSV",
  toolbarExportPrint: "Stampa",
  toolbarExportExcel: "Scarica come Excel",

  // Columns panel text
  columnsPanelTextFieldLabel: "Trova colonna",
  columnsPanelTextFieldPlaceholder: "Titolo colonna",
  columnsPanelDragIconLabel: "Riordina colonna",
  columnsPanelShowAllButton: "Mostra tutto",
  columnsPanelHideAllButton: "Nascondi tutto",

  // Filter panel text
  filterPanelAddFilter: "Aggiungi filtro",
  filterPanelRemoveAll: "Rimuovi tutti",
  filterPanelDeleteIconLabel: "Elimina",
  filterPanelLogicOperator: "Operatore logico",
  filterPanelOperator: "Operatore",
  filterPanelOperatorAnd: "E",
  filterPanelOperatorOr: "O",
  filterPanelColumns: "Colonne",
  filterPanelInputLabel: "Valore",
  filterPanelInputPlaceholder: "Valore filtro",

  // Filter operators text
  filterOperatorContains: "contiene",
  filterOperatorEquals: "uguale a",
  filterOperatorStartsWith: "inizia con",
  filterOperatorEndsWith: "finisce con",
  filterOperatorIs: "è",
  filterOperatorNot: "non è",
  filterOperatorAfter: "è dopo",
  filterOperatorOnOrAfter: "è in o dopo",
  filterOperatorBefore: "è prima",
  filterOperatorOnOrBefore: "è in o prima",
  filterOperatorIsEmpty: "è vuoto",
  filterOperatorIsNotEmpty: "non è vuoto",
  filterOperatorIsAnyOf: "è uno di",
  "filterOperator=": "=",
  "filterOperator!=": "!=",
  "filterOperator>": ">",
  "filterOperator>=": ">=",
  "filterOperator<": "<",
  "filterOperator<=": "<=",

  // Header filter operators text
  headerFilterOperatorContains: "Contiene",
  headerFilterOperatorEquals: "Uguale",
  headerFilterOperatorStartsWith: "Inizia con",
  headerFilterOperatorEndsWith: "Finisce con",
  headerFilterOperatorIs: "È",
  headerFilterOperatorNot: "Non è",
  headerFilterOperatorAfter: "È dopo",
  headerFilterOperatorOnOrAfter: "È in o dopo",
  headerFilterOperatorBefore: "È prima",
  headerFilterOperatorOnOrBefore: "È in o prima",
  headerFilterOperatorIsEmpty: "È vuoto",
  headerFilterOperatorIsNotEmpty: "Non è vuoto",
  headerFilterOperatorIsAnyOf: "È uno di",
  "headerFilterOperator=": "Uguale",
  "headerFilterOperator!=": "Diverso da",
  "headerFilterOperator>": "È maggiore di",
  "headerFilterOperator>=": "È maggiore o uguale a",
  "headerFilterOperator<": "È minore di",
  "headerFilterOperator<=": "È minore o uguale a",

  // Filter values text
  filterValueAny: "qualsiasi",
  filterValueTrue: "vero",
  filterValueFalse: "falso",

  // Column menu text
  columnMenuLabel: "Menu",
  columnMenuShowColumns: "Mostra colonne",
  columnMenuManageColumns: "Gestisci colonne",
  columnMenuFilter: "Filtra",
  columnMenuHideColumn: "Nascondi colonna",
  columnMenuUnsort: "Annulla ordinamento",
  columnMenuSortAsc: "Ordina in ordine crescente",
  columnMenuSortDesc: "Ordina in ordine decrescente",

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtri attivi` : `${count} filtro attivo`,
  columnHeaderFiltersLabel: "Mostra filtri",
  columnHeaderSortIconLabel: "Ordina",

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} righe selezionate`
      : `${count.toLocaleString()} riga selezionata`,

  // Total row amount footer text
  footerTotalRows: "Totale righe:",

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} di ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: "Selezione casella di controllo",
  checkboxSelectionSelectAllRows: "Seleziona tutte le righe",
  checkboxSelectionUnselectAllRows: "Deseleziona tutte le righe",
  checkboxSelectionSelectRow: "Seleziona riga",
  checkboxSelectionUnselectRow: "Deseleziona riga",

  // Boolean cell text
  booleanCellTrueLabel: "sì",
  booleanCellFalseLabel: "no",

  // Actions cell more text
  actionsCellMore: "altro",

  // Column pinning text
  pinToLeft: "Fissa a sinistra",
  pinToRight: "Fissa a destra",
  unpin: "Sblocca",

  // Tree Data
  treeDataGroupingHeaderName: "Raggruppa",
  treeDataExpand: "vedi figli",
  treeDataCollapse: "nascondi figli",

  // Grouping columns
  groupingColumnHeaderName: "Raggruppa",
  groupColumn: (name) => `Raggruppa per ${name}`,
  unGroupColumn: (name) => `Interrompi raggruppamento per ${name}`,

  // Master/detail
  detailPanelToggle: "Attiva",
  detailPanelToggle: "Attiva/Disattiva pannello dettagli",
  expandDetailPanel: "Espandi",
  collapseDetailPanel: "Comprimi",

  // Used core components translation keys
  MuiTablePagination: {},

  // Row reordering text
  rowReorderingHeaderName: "Riordino righe",

  // Aggregation
  aggregationMenuItemHeader: "Aggregazione",
  aggregationFunctionLabelSum: "somma",
  aggregationFunctionLabelAvg: "media",
  aggregationFunctionLabelMin: "minimo",
  aggregationFunctionLabelMax: "massimo",
  aggregationFunctionLabelSize: "dimensione",
};
