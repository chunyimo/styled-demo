
// 是否是原生的dom标签
export default function isTag(
  target
)  {
  return (
    typeof target === 'string' &&
    (process.env.NODE_ENV !== 'production'
      ? target.charAt(0) === target.charAt(0).toLowerCase()
      : true)
  );
}
