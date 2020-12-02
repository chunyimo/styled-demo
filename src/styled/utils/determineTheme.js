
import { EMPTY_OBJECT } from './empties';

// type Props = {
//   theme?,
// };

export default (props, providedTheme, defaultProps = EMPTY_OBJECT) => {
  return (props.theme !== defaultProps.theme && props.theme) || providedTheme || defaultProps.theme;
};
