import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const getQueryParam = (key: string) => {
  const params = new URLSearchParams(location.search);
  return params.get(key) ?? undefined;
};

export const useSyncStateArray = (key: string, value: any, setValue: (newValue: any) => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (value) {
      const params = new URLSearchParams(window.location.search);
      params.delete(key);
      value.forEach((v: any) => params.append(key, v));

      navigate(`?${params.toString()}`, {
        replace: true,
      });
    } else {
      const params = new URLSearchParams(window.location.search);
      params.delete(key);
      navigate(`?${params.toString()}`, {
        replace: true,
      });
    }
  }, [value, key, navigate]);

  const { search } = useLocation();
  useEffect(() => setValue(getQueryParam(key)), [search]);
};
