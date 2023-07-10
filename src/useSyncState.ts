import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const getQueryParam = (key: string) => {
  const params = new URLSearchParams(location.search);
  return params.get(key) ?? undefined;
};

export const useSyncState = (key: string, value: any, setValue: (newValue: any) => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (value) {
      const params = new URLSearchParams(location.search);
      params.set(key, `${value}`);
      navigate(`?${params.toString()}`, {
        replace: true,
      });
    } else {
      const params = new URLSearchParams(location.search);
      params.delete(key);
      navigate(`?${params.toString()}`, {
        replace: true,
      });
    }
  }, [value, key, navigate]);

  useEffect(() => setValue(getQueryParam(key)), [location.search]);
};
