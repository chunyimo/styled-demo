
export default function isStyledComponent(target)  {
  return target && typeof target.styledComponentId === 'string';
}
