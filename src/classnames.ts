export const classnames = (...args: unknown[]) =>
  args
    .flat()
    .filter((x) => typeof x === "string")
    .join(" ")
    .trim();
