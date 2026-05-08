export type ColumnFilterType = "dateRange" | "range" | "select" | "text";

type PrimitiveFilterValue = boolean | number | string | null;
type RangeFilterValue = [PrimitiveFilterValue, PrimitiveFilterValue];
type SelectFilterValue = Array<number | string>;

export type FilterItem = {
  id: string;
  type: ColumnFilterType;
  value: PrimitiveFilterValue | RangeFilterValue | SelectFilterValue;
};

export type ApiQueryParams = {
  columnFilters: FilterItem[];
  page: number;
  size: number;
  sort?: string;
};

const RANGE_REGEX = /_(from|to)$/;
const SELECT_REGEX = /_list$/;

function parseFilterValue(value: string): number | string {
  return Number.isNaN(Number(value)) ? value : Number(value);
}

function isPresentFilterValue(
  value: PrimitiveFilterValue | undefined,
): value is boolean | number | string {
  return value !== null && value !== undefined && value !== "";
}

function createRangeFilter(id: string): FilterItem {
  return {
    id,
    type: "range",
    value: [null, null],
  };
}

function createSelectFilter(id: string): FilterItem {
  return {
    id,
    type: "select",
    value: [],
  };
}

function inferRangeFilterType(values: Array<string | null>): ColumnFilterType {
  const populatedValues = values.filter(
    (value): value is string => value !== null && value !== "",
  );

  if (populatedValues.length === 0) {
    return "range";
  }

  const hasDateLikeValue = populatedValues.some((value) => {
    if (!Number.isNaN(Number(value))) {
      return false;
    }

    return !Number.isNaN(Date.parse(value));
  });

  return hasDateLikeValue ? "dateRange" : "range";
}

export function serializeFilters({
  columnFilters,
  page = 0,
  size = 10,
  sort,
}: {
  columnFilters?: FilterItem[];
  page?: number;
  size?: number;
  sort?: string;
}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("size", String(size));

  if (sort) {
    params.set("sort", sort);
  }

  if (!columnFilters || columnFilters.length === 0) {
    return params.toString();
  }

  for (const filter of columnFilters) {
    if (filter.type === "range" || filter.type === "dateRange") {
      const [from, to] = Array.isArray(filter.value)
        ? (filter.value as RangeFilterValue)
        : [null, null];

      if (isPresentFilterValue(from)) {
        params.set(`${filter.id}_from`, String(from));
      }

      if (isPresentFilterValue(to)) {
        params.set(`${filter.id}_to`, String(to));
      }

      continue;
    }

    if (filter.type === "select") {
      const values = Array.isArray(filter.value)
        ? (filter.value as SelectFilterValue)
        : [];

      for (const value of values) {
        params.append(`${filter.id}_list`, String(value));
      }

      continue;
    }

    if (filter.type === "text") {
      const textValue = Array.isArray(filter.value)
        ? ""
        : String(filter.value ?? "");
      params.set(filter.id, textValue);
    }
  }

  return params.toString();
}

export function deserializeFilters(query: string) {
  const params = new URLSearchParams(query);
  const page = Number(params.get("page") ?? 0);
  const size = Number(params.get("size") ?? 10);
  const sort = params.get("sort") ?? undefined;
  const filterMap: Record<string, FilterItem> = {};

  for (const [key, value] of params.entries()) {
    if (key === "page" || key === "size" || key === "sort") {
      continue;
    }

    if (key.endsWith("_from") || key.endsWith("_to")) {
      const id = key.replace(RANGE_REGEX, "");

      if (filterMap[id]) {
        const existingValues = Array.isArray(filterMap[id].value)
          ? (filterMap[id].value as RangeFilterValue)
          : [null, null];

        filterMap[id].type = inferRangeFilterType([
          String(existingValues[0]),
          String(existingValues[1]),
          value,
        ]);
      } else {
        filterMap[id] = createRangeFilter(id);
        filterMap[id].type = inferRangeFilterType([value]);
      }

      const parsed = value === "" ? null : parseFilterValue(value);
      const rangeValue: RangeFilterValue = Array.isArray(filterMap[id].value)
        ? ([...filterMap[id].value] as RangeFilterValue)
        : [null, null];

      if (key.endsWith("_from")) {
        rangeValue[0] = parsed;
      } else {
        rangeValue[1] = parsed;
      }

      filterMap[id].value = rangeValue;
      continue;
    }

    if (key.endsWith("_list")) {
      const id = key.replace(SELECT_REGEX, "");

      if (!filterMap[id]) {
        filterMap[id] = createSelectFilter(id);
      }

      const selectedValues = Array.isArray(filterMap[id].value)
        ? ([...filterMap[id].value] as SelectFilterValue)
        : [];
      selectedValues.push(parseFilterValue(value));
      filterMap[id].value = selectedValues;
      continue;
    }

    if (!filterMap[key]) {
      filterMap[key] = {
        id: key,
        type: "text",
        value: value ?? null,
      };
    }
  }

  const columnFilters = Object.values(filterMap);

  if (columnFilters.length === 0) {
    return { page, size, sort };
  }

  return {
    columnFilters,
    page,
    size,
    sort,
  };
}
