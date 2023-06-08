import { Box, LinearProgress, Rating, alpha } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import _ from "lodash";
import * as React from "react";
import {
  DEPARTMENT_PERSONS,
  GRID_DEFAULT_LOCALE_ITALIAN_TEXT,
  MOVIE_CARD_HEIGHT_DATA_GRID,
  MOVIE_CARD_WIDTH_DATA_GRID,
} from "../utils/constant";
import { roundToHalf } from "../utils/numberFormatting";
import MovieCard from "./MovieCard";

import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function TrendValue({ value }) {
  const currentPopularity = Number.parseFloat(value).toFixed(0);

  if (currentPopularity >= 1000) {
    return <TrendingUpIcon color="success" fontSize={"medium"} />;
  } else if (currentPopularity >= 100) {
    return <TrendingFlatIcon color="inherit" fontSize={"medium"} />;
  } else {
    return <TrendingDownIcon color="error" fontSize={"medium"} />;
  }
}

function RatingInputValue(props) {
  const { item, applyValue, focusElementRef } = props;

  const ratingRef = React.useRef(null);
  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      ratingRef.current
        .querySelector(`input[value="${Number(item.value) || ""}"]`)
        .focus();
    },
  }));

  const handleFilterChange = (event, newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        height: 48,
        pl: "20px",
      }}
    >
      <Rating
        name="custom-rating-filter-operator"
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
        ref={ratingRef}
      />
    </Box>
  );
}

const ratingOnlyOperators = [
  {
    label: "Uguale a",
    value: "equals",
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (params) => {
        return Number(filterItem.value) == Number(roundToHalf(params.value));
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: "number" },
    getValueAsString: (value) => value,
  },
  {
    label: "Maggiore o uguale",
    value: "superiorOrEqual",
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (params) => {
        return Number(roundToHalf(params.value)) >= Number(filterItem.value);
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: "number" },
    getValueAsString: (value) => value,
  },
  {
    label: "Minore o uguale",
    value: "minusOrequal",
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (params) => {
        return Number(roundToHalf(params.value)) <= Number(filterItem.value);
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: "number" },
    getValueAsString: (value) => value,
  },
];

export default function DataGridListCreditsPerson({ data, subItemClick }) {
  const OVERDROW = 10;

  const filtered = _.uniqBy(data, "id");

  const columns = [
    {
      field: "bg",
      headerName: "",
      width: MOVIE_CARD_WIDTH_DATA_GRID + OVERDROW,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        const { title, bg } = params.row;

        return (
          <MovieCard
            title={title}
            bg={bg}
            w={MOVIE_CARD_WIDTH_DATA_GRID}
            h={MOVIE_CARD_HEIGHT_DATA_GRID - OVERDROW}
          />
        );
      },
    },
    {
      field: "title",
      headerName: "Titolo",
      filterable: false,
      flex: 1,
    },
    {
      field: "department",
      headerName: "Reparto",
      type: "singleSelect",
      valueOptions: Object.values(DEPARTMENT_PERSONS).map((d) => d),
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Voto",
      filterOperators: ratingOnlyOperators,
      flex: 1,
      renderCell: (params) => {
        const { rating } = params.row;

        return (
          <Rating
            size={"medium"}
            value={roundToHalf(rating)}
            precision={0.5}
            readOnly
          />
        );
      },
    },
    {
      field: "popularity",
      headerName: "Trend",
      filterable: false,
      width: 80,
      align: "center",
      renderCell: (params) => {
        const { popularity } = params.row;

        return <TrendValue value={popularity} />;
      },
    },
  ];

  const rows = filtered?.map(
    ({
      id,
      poster_path,
      title,
      name,
      department,
      vote_average,
      popularity,
      media_type,
    }) => {
      return {
        id,
        bg: poster_path,
        title: title || name,
        department: department
          ? DEPARTMENT_PERSONS?.[department]
          : "Recitazione",
        rating: vote_average,
        popularity,
        media_type,
      };
    }
  );

  return (
    <DataGrid
      autoHeight
      width={"100%"}
      onRowClick={(params, event) => {
        event.stopPropagation();
        subItemClick(params.row.id, params.row.media_type);
      }}
      rows={rows}
      columns={columns}
      getRowHeight={(params) => {
        return MOVIE_CARD_HEIGHT_DATA_GRID;
      }}
      initialState={{
        sorting: {
          sortModel: [{ field: "popularity", sort: "desc" }],
        },
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      localeText={GRID_DEFAULT_LOCALE_ITALIAN_TEXT}
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        loadingOverlay: LinearProgress,
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      disableRowSelectionOnClick
      disableColumnSelector
      sx={{
        borderColor: (theme) => alpha(theme.palette.background.paper, 0.5),
        cursor: "pointer",
        "& .MuiDataGrid-cell:focus": {
          outline: "0px solid transparent",
        },
        "& .MuiDataGrid-columnHeader:focus": {
          outline: "0px solid transparent",
        },
        "& .MuiDataGrid-columnHeader:focus-within": {
          outline: "0px solid transparent",
        },
        "& .MuiDataGrid-iconSeparator": {
          display: "none",
        },
        "& .MuiDataGrid-withBorderColor": {
          borderColor: (theme) => alpha(theme.palette.background.paper, 0.5),
        },
        "& .MuiDataGrid-virtualScroller": {
          overflowX: "hidden",
        },
      }}
    />
  );
}
