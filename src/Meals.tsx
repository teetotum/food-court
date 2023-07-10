import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { data, Meal } from './data';
import style from './meals.module.scss';
import { classnames } from './classnames';
import { useURLSearchParam } from './useURLSearchParam';
//import { useSyncState } from './useSyncState';
//import { useSyncState } from './useSyncStateCorrected';
import { useSyncStateArray } from './useSyncStateArray';

const getQueryParam = (key: string) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? undefined;
};

export const Meals = () => {
  const [sorting, setSorting] = useState<SortState>();
  const sorted = sorting ? [...data].sort(getSortingFunction(sorting)) : data;
  const [filter, setFilter] = useState<string | undefined>(() => getQueryParam('filter'));
  const [filters, setFilters] = useState<string[]>([]);
  const filtered = filter ? sorted.filter((x) => x.type === filter) : sorted;
  const toggleFilter = (value: string) => setFilter((cur) => (cur === value ? undefined : value));
  const isActiveFilter = (value: string) => filter === value;

  // SIMPLEST APPROACH
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (filter)
  //     navigate(`?filter=${filter}`, { replace: true });
  //   else navigate('');
  // }, [filter]);

  // REFINED APPROACH
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (filter) {
  //     const params = new URLSearchParams(window.location.search);
  //     params.set('filter', `${filter}`);
  //     navigate(`?${params.toString()}`, {
  //       replace: true,
  //     });
  //   } else {
  //     const params = new URLSearchParams(window.location.search);
  //     params.delete('filter');
  //     navigate(`?${params.toString()}`, {
  //       replace: true,
  //     });
  //   }
  // }, [filter]);

  // const { search } = useLocation();
  // useEffect(() => setFilter(getQueryParam('filter')), [search]);

  // HOOK APPROACH
  // useSyncState('sortkey', sorting?.sortkey, (v) =>
  //   setSorting((s) => ({ sortkey: v, direction: s?.direction ?? 'ascending' }))
  // );
  useSyncState('filter', filter, setFilter);
  useSyncState('sorting', sorting ? `${sorting.sortkey},${sorting.direction}` : undefined, (s) => {
    if (s) {
      const [sortkey, direction] = s.split(',');
      setSorting({ sortkey, direction });
    } else {
      setSorting(undefined);
    }
  });
  useSyncStateArray('filters', filters, (_) => {
    console.log(_);
  });
  useEffect(() => {
    if (filter)
      setFilters((fs) => {
        if (fs.includes(filter)) return [...fs];
        else return [...fs, filter];
      });
  }, [filter]);

  return (
    <div className={style.meals}>
      <button
        onClick={() => {
          setSorting(undefined);
          setFilter(undefined);
        }}
      >
        clear
      </button>
      <div className={style.filters}>
        <label>
          Burger
          <input type='checkbox' checked={isActiveFilter('Burger')} onChange={(e) => toggleFilter('Burger')} />
        </label>
        <label>
          Pasta
          <input type='checkbox' checked={isActiveFilter('Pasta')} onChange={(e) => toggleFilter('Pasta')} />
        </label>
        <label>
          Roast
          <input type='checkbox' checked={isActiveFilter('Roast')} onChange={(e) => toggleFilter('Roast')} />
        </label>
      </div>
      <table className={style.mealsTable}>
        <thead>
          <tr>
            <th>
              <div className={style.sortingHeader}>
                <span>{'Name'}</span>
                <SortButtons sortkey='name' state={sorting} setState={setSorting} />
              </div>
            </th>
            <th>
              <div className={style.sortingHeader}>
                <span>{'Type'}</span>
                <SortButtons sortkey='type' state={sorting} setState={setSorting} />
              </div>
            </th>
            <th>
              <div className={style.sortingHeader}>
                <span>{'Description'}</span>
                <SortButtons sortkey='description' state={sorting} setState={setSorting} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((meal: Meal) => (
            <tr key={meal.id}>
              <td>{meal.name}</td>
              <td>{meal.type}</td>
              <td>{meal.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// first implementation with useURLSearchParam hook:
//
// const [url_sorting, _update, _delete] = useURLSearchParam("sorting");
// useEffect(() => {
//   if (!sorting) _delete();
//   else _update([sorting?.sortkey, sorting?.direction]);
// }, [sorting?.sortkey, sorting?.direction]);

// SIMPLEST APPROACH
//const navigate = useNavigate();
// useEffect(() => {
//   if (sorting?.sortkey && sorting?.direction)
//     navigate(`?sorting=${sorting?.sortkey},${sorting?.direction}`, {
//       replace: true,
//     });
//   else navigate("");
// }, [sorting?.sortkey, sorting?.direction]);

interface SortState {
  sortkey: string;
  direction: 'ascending' | 'descending';
}

interface SortButtonsProps {
  sortkey: string;
  state?: SortState;
  setState: (newstate?: SortState) => void;
}

export const unchanged = (_a: unknown, _b: unknown) => 0;

const alphabeticalCompare = (a: string, b: string): number => {
  const aIsInvalid = typeof a !== 'string';
  const bIsInvalid = typeof b !== 'string';

  if (aIsInvalid && bIsInvalid) {
    return 0;
  }

  if (aIsInvalid) {
    return -1;
  }

  if (bIsInvalid) {
    return +1;
  }

  return a.localeCompare(b);
};

export const alphabeticalSorting = (key: string) => {
  const ascending = (a: any, b: any) => alphabeticalCompare(a?.[key], b?.[key]);
  const descending = (a: any, b: any) => ascending(a, b) * -1;

  return { ascending, descending };
};

export const numericalCompare = (a: number, b: number): number => {
  const aIsNan = Number.isNaN(a);
  const bIsNan = Number.isNaN(b);

  if (aIsNan && bIsNan) {
    return 0;
  }

  if (aIsNan) {
    return -1;
  }

  if (bIsNan) {
    return +1;
  }

  return a - b;
};

export const numericalSorting = (key: string) => {
  const ascending = (a: any, b: any) => numericalCompare(a?.[key], b?.[key]);
  const descending = (a: any, b: any) => ascending(a, b) * -1;
  return { ascending, descending };
};

const stringLengthSorting = (key: string) => {
  const ascending = (a: any, b: any) => numericalCompare(a?.[key]?.length, b?.[key]?.length);
  const descending = (a: any, b: any) => ascending(a, b) * -1;
  return { ascending, descending };
};

const sortName = alphabeticalSorting('name');
const sortType = alphabeticalSorting('type');
const sortDescription = stringLengthSorting('description');

// key
// direction
// comparer

const getSortingFunction = (s: SortState): CompareFn<Meal> => {
  const ascending: CompareFn<Meal> = mapping[s.sortkey];
  const descending = (a: Meal, b: Meal) => ascending(a, b) * -1;

  return s.direction === 'ascending' ? ascending : descending;
};

const mapping: any = {
  name: (a: Meal, b: Meal) => alphabeticalCompare(a?.name, b?.name),
  type: (a: Meal, b: Meal) => alphabeticalCompare(a?.type, b?.type),
  description: (a: Meal, b: Meal) => numericalCompare(a?.description?.length, b?.description?.length),
};

interface CompareFn<TItem> {
  (a: TItem, b: TItem): number;
}

const SortButtons = ({ sortkey, state, setState }: SortButtonsProps) => {
  const isActive = state?.sortkey === sortkey;

  const sortedAscending = isActive && state?.direction === 'ascending';
  const sortedDescending = isActive && state?.direction === 'descending';

  const reset = () => setState(undefined);

  return (
    <div className={classnames(style.sortingButtons, isActive && style.isActive)}>
      <button
        type='button'
        className={classnames(style.sortButton, style.sortAscending, sortedAscending && style.isActive)}
        onClick={() => (sortedAscending ? reset() : setState({ sortkey, direction: 'ascending' }))}
      ></button>
      <button
        type='button'
        className={classnames(style.sortButton, style.sortDescending, sortedDescending && style.isActive)}
        onClick={() => (sortedDescending ? reset() : setState({ sortkey, direction: 'descending' }))}
      ></button>
    </div>
  );
};
