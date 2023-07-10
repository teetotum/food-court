import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deserialize, serialize } from "./searchParamUtils";

/* prettier-ignore */
const getDecodedUrlParam = ( name: string, locationSearch: string, _default?: any ): any => {
  const params = deserialize(locationSearch);
  const param = params[name];

  if (_default && Array.isArray(_default)) {
    return param
      ? param.split(',').map((v: string) => decodeURIComponent(v))
      : _default;
  }

  return param ? decodeURIComponent(param) : _default;
};

export const useURLSearchParam = (name: string, _default?: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const value: any = getDecodedUrlParam(name, location.search, _default);

  const _update = useCallback(
    (value: any) => {
      const params = deserialize(window.location.search);
      if (Array.isArray(value)) {
        params[name] = value.map((v) => encodeURIComponent(v)).join(",");
      } else {
        params[name] = encodeURIComponent(value);
      }

      navigate(
        {
          hash: location.hash,
          pathname: location.pathname,
          search: serialize(params),
        },
        { replace: true }
      );
    },
    [navigate, location, name]
  );

  const _delete = useCallback(() => {
    const params = deserialize(window.location.search);
    delete params[name];
    navigate(
      {
        hash: location.hash,
        pathname: location.pathname,
        search: serialize(params),
      },
      { replace: true }
    );
  }, [navigate, location, name]);

  return [value, _update, _delete];
};
