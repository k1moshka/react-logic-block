import getPath from "lodash/get";

export const wasPropChanged = (
  props: Record<string, any>,
  prevProps: Record<string, any>,
  ...paths: Array<string>
) => {
  return paths.reduce(
    (acc, path) => acc || getPath(props, path) !== getPath(prevProps, path),
    false
  );
};
