

export default function getComponentName(
  target
) {
  return (
    (process.env.NODE_ENV !== 'production' ? typeof target === 'string' && target : false) ||
    // $FlowFixMe
    target.displayName ||
    // $FlowFixMe
    target.name ||
    'Component'
  );
}
