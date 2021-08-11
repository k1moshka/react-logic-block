import getPath from 'lodash/get'

export const wasPropChanged = (props: Object, prevProps: Object, ...paths: Array<string>) => {
  return paths.reduce(
    (acc, path) => acc || getPath(props, path) !== getPath(prevProps, path),
    false
  )
}
