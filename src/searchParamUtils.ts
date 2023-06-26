interface Hash<T> {
  [key: string]: T;
}

export const deserialize = (locationSearch: string): Record<string, string> => {
  if (locationSearch === "") {
    return {};
  }
  if (locationSearch.startsWith("?")) {
    locationSearch = locationSearch.substring(1);
  }
  const parts = locationSearch.split("&");
  return Object.fromEntries(parts.map((part) => part.split("=")));
};

export const serialize = (params: Record<string, string>) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

export const getAllRawUrlParams = (locationSearch: string): Hash<string> => {
  if (locationSearch.startsWith("?")) {
    locationSearch = locationSearch.substring(1);
  }
  const parts = locationSearch.split("&");
  return Object.fromEntries(parts.map((part) => part.split("=")));
};

const getRawUrlParam = (locationSearch: string, key: string): string => {
  const params = getAllRawUrlParams(locationSearch);
  return params[key];
};

const getRawUrlParamStartsWith = (
  locationSearch: string,
  keyStartsWith: string
): string[] => {
  const params = getAllRawUrlParams(locationSearch);
  return Object.entries(params).find(([key]) => key.startsWith(keyStartsWith));
};

export const getSearchParamValue = (
  locationSearch: string,
  paramKey: string
): string => {
  return new URLSearchParams(locationSearch).get(paramKey) ?? "";
};

const containsNoValues = (array: any[]) => !array.some((v) => v);

export const getSearchParam = (
  locationSearch: string,
  paramKey: string
): string[] => {
  const param = getSearchParamValue(locationSearch, paramKey);
  const params = param.split(",");
  return containsNoValues(params) ? [] : params;
};

export const getUrlParam = (locationSearch: string, key: string): string[] => {
  const param = getRawUrlParam(locationSearch, key);
  return param
    ? param.split(",").map((v: string) => decodeURIComponent(v))
    : [];
};

export const getUrlParamStartsWith = (
  locationSearch: string,
  keyStartsWith: string
): string[] => {
  const kvp = getRawUrlParamStartsWith(locationSearch, keyStartsWith);
  if (kvp) {
    const [key, value] = kvp;
    return [key, decodeURIComponent(value)];
  }
  return undefined;
};
