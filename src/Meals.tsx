import { useState, useEffect } from "react";
import { data, Meal } from "./data";
import style from "./meals.module.scss";
import { classnames } from "./classnames";
import { useURLSearchParam } from "./useURLSearchParam";

export const unchanged = (_a: unknown, _b: unknown) => 0;

const alphabeticalCompare = (a: string, b: string): number => {
  const aIsInvalid = typeof a !== "string";
  const bIsInvalid = typeof b !== "string";

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
  const ascending = (a: any, b: any) =>
    numericalCompare(a?.[key]?.length, b?.[key]?.length);
  const descending = (a: any, b: any) => ascending(a, b) * -1;
  return { ascending, descending };
};

const sortName = alphabeticalSorting("name");
const sortType = alphabeticalSorting("type");
const sortDescription = stringLengthSorting("description");

// key
// direction
// comparer

interface SortState {
  sortkey: string;
  direction: "ascending" | "descending";
}

interface SortButtonsProps {
  sortkey: string;
  state?: SortState;
  setState: (newstate?: SortState) => void;
}

const SortButtons = ({ sortkey, state, setState }: SortButtonsProps) => {
  const isActive = state?.sortkey === sortkey;

  const sortedAscending = isActive && state?.direction === "ascending";
  const sortedDescending = isActive && state?.direction === "descending";

  const reset = () => setState(undefined);

  return (
    <div
      className={classnames(style.sortingButtons, isActive && style.isActive)}
    >
      <button
        type="button"
        className={classnames(
          style.sortButton,
          style.sortAscending,
          sortedAscending && style.isActive
        )}
        onClick={() =>
          sortedAscending
            ? reset()
            : setState({ sortkey, direction: "ascending" })
        }
      ></button>
      <button
        type="button"
        className={classnames(
          style.sortButton,
          style.sortDescending,
          sortedDescending && style.isActive
        )}
        onClick={() =>
          sortedDescending
            ? reset()
            : setState({ sortkey, direction: "descending" })
        }
      ></button>
    </div>
  );
};

const mapping: any = {
  name: (a: Meal, b: Meal) => alphabeticalCompare(a?.name, b?.name),
  type: (a: Meal, b: Meal) => alphabeticalCompare(a?.type, b?.type),
  description: (a: Meal, b: Meal) =>
    numericalCompare(a?.description?.length, b?.description?.length),
};

interface CompareFn<TItem> {
  (a: TItem, b: TItem): number;
}

const getSortingFunction = (s: SortState): CompareFn<Meal> => {
  const ascending: CompareFn<Meal> = mapping[s.sortkey];
  const descending = (a: Meal, b: Meal) => ascending(a, b) * -1;

  return s.direction === "ascending" ? ascending : descending;
};

export const Meals = () => {
  const [sorting, setSorting] = useState<SortState>();

  const sorted = sorting ? [...data].sort(getSortingFunction(sorting)) : data;

  const [url_sorting, _update, _delete] = useURLSearchParam("sorting");
  useEffect(() => {
    if (!sorting) _delete();
    else _update([sorting?.sortkey, sorting?.direction]);
  }, [sorting?.sortkey, sorting?.direction]);

  const [filter, setFilter] = useState<any>({});

  const filtered = Object.entries(filter).some(([k, v]) => v)
    ? sorted.filter((x) => {
        if (filter.burger && x.type === "Burger") return true;
        if (filter.pasta && x.type === "Pasta") return true;
        if (filter.roast && x.type === "Roast") return true;
        return false;
      })
    : sorted;

  return (
    <>
      <div className={style.filters}>
        <span>Filters</span>
        <label>
          Burger
          <input
            type="checkbox"
            name="burger"
            checked={filter.burger}
            onChange={(e) => setFilter({ burger: e.target.checked })}
          />
        </label>
        <label>
          Pasta
          <input
            type="checkbox"
            name="pasta"
            checked={filter.pasta}
            onChange={(e) => setFilter({ pasta: e.target.checked })}
          />
        </label>
        <label>
          Roast
          <input
            type="checkbox"
            name="roast"
            checked={filter.roast}
            onChange={(e) => setFilter({ roast: e.target.checked })}
          />
        </label>
      </div>
      <table className={style.meals}>
        <thead>
          <tr>
            <th>
              <div className={style.sortingHeader}>
                <span>{"Name"}</span>
                <SortButtons
                  sortkey="name"
                  state={sorting}
                  setState={setSorting}
                />
              </div>
            </th>
            <th>
              <div className={style.sortingHeader}>
                <span>{"Type"}</span>
                <SortButtons
                  sortkey="type"
                  state={sorting}
                  setState={setSorting}
                />
              </div>
            </th>
            <th>
              <div className={style.sortingHeader}>
                <span>{"Description"}</span>
                <SortButtons
                  sortkey="description"
                  state={sorting}
                  setState={setSorting}
                />
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
    </>
  );
};
