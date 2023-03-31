import {
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popper,
} from "@mui/material";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { VariableSizeList } from "react-window";
import { fetchCasts } from "../api/tmdbApis";
import LoadingPage from "./LoadingPage";

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
    borderBottom: "1px solid #9c9c9c1c",
  };

  return (
    <ListItem
      component="li"
      {...dataSet[0]}
      style={inlineStyle}
      noWrap
      disableGutters
    >
      <ListItemAvatar>
        <Avatar
          alt={`Avatar ${dataSet?.[1]?.name}`}
          src={`http://image.tmdb.org/t/p/w500${dataSet?.[1]?.profile_path}`}
        />
      </ListItemAvatar>
      <ListItemText
        id={dataSet?.[1]?.labelId}
        disableTypography
        primary={
          <Typography variant="subtitle2">{dataSet?.[1]?.name}</Typography>
        }
        secondary={
          <Typography variant="caption">{dataSet?.[1]?.character}</Typography>
        }
      />
    </ListItem>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const [lastvisibleIndex, setLastVisibleIndex] = React.useState(0);
  const { children, ...other } = props;

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = other;

  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const itemCount = itemData.length;
  const itemSize = 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  function onItemsRendered({ visibleStopIndex }) {
    setLastVisibleIndex(visibleStopIndex);
  }

  function onScroll({
    scrollDirection,
    scrollOffset,
    scrollUpdateWasRequested,
  }) {
    const listHeight = getHeight() + 2 * LISTBOX_PADDING;
    const scrollPercentage = scrollOffset / listHeight;

    if (
      !scrollUpdateWasRequested &&
      scrollPercentage >= 0.8 &&
      scrollDirection === "forward" &&
      lastvisibleIndex > itemCount - 10 &&
      hasNextPage
    ) {
      fetchNextPage();
    }
  }

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          onScroll={onScroll}
          onItemsRendered={onItemsRendered}
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export default function AutocompleteCastSetting() {
  const prevSelectedItems = useSelector((state) => state.movieQuery.cast);
  const [selectedItems, setSelectedItems] = React.useState(prevSelectedItems);
  const [inputValue, setInputValue] = React.useState(null);

  const {
    status,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["cast"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => fetchCasts(pageParam),
  });

  if (status === "loading") return <LoadingPage />;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  const cast = data?.pages
    ?.flatMap((data) => data)
    .reduce((prev, curr) => {
      return {
        ...curr,
        results: prev?.results
          ? prev.results.concat(curr.results)
          : curr.results,
      };
    }, {});

  const visibleData = cast?.results?.filter(
    (item) => !selectedItems?.find((sItem) => sItem.id === item.id)
  );

  const itemData = {
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };

  const handleChange = (value) => {
    setSelectedItems(value);
  };
  const handleDelete = (value) => {
    const newSelectedItems = selectedItems.filter(
      (sItem) => sItem.id !== value.id
    );
    setSelectedItems(newSelectedItems);
  };

  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      disableListWrap
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      ListboxProps={itemData}
      options={visibleData}
      loading={isFetchingNextPage}
      getOptionLabel={(option) => option.name}
      value={selectedItems}
      onChange={(event, newValue) => {
        handleChange(newValue);
      }}
      filterSelectedOptions
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => {
          const existPath = option?.profile_path ? (
            <Avatar
              alt={option?.name}
              src={`http://image.tmdb.org/t/p/w500${option.profile_path}`}
            />
          ) : (
            <Avatar>{option?.name?.charAt(0)}</Avatar>
          );
          return (
            <Chip
              avatar={existPath}
              label={option?.name}
              {...getTagProps({ index })}
              onDelete={() => handleDelete(option)}
            />
          );
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={
            selectedItems.length > 0 ? "" : "Aggiungi o rimuovi cast"
          }
        />
      )}
      renderOption={(props, option, state) => [props, option, state.index]}
    />
  );
}
