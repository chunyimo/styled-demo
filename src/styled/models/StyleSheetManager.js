
import React, { useContext, useEffect, useMemo, useState } from 'react';
import shallowequal from 'shallowequal';
import StyleSheet from '../sheet';
import createStylisInstance from '../utils/stylis';

// type Props = {
//   children?: Node,
//   disableCSSOMInjection?,
//   disableVendorPrefixes?,
//   sheet?,
//   stylisPlugins?: Array<Function>,
//   target?: HTMLElement,
// };

export const StyleSheetContext = React.createContext();
export const StyleSheetConsumer = StyleSheetContext.Consumer;
export const StylisContext = React.createContext();
export const StylisConsumer = StylisContext.Consumer;

export const masterSheet = new StyleSheet();
export const masterStylis = createStylisInstance();

export function useStyleSheet() {
  const _StyleSheetContext = useContext(StyleSheetContext);
  console.log(masterSheet);
  return _StyleSheetContext || masterSheet;
}

export function useStylis() {
  const _StylisContext = useContext(StylisContext);
  console.log(masterStylis);
  return _StylisContext || masterStylis;
}

// export default function StyleSheetManager(props) {
//   const [plugins, setPlugins] = useState(props.stylisPlugins);
//   const contextStyleSheet = useStyleSheet();

//   const styleSheet = useMemo(() => {
//     let sheet = contextStyleSheet;

//     if (props.sheet) {
//       // eslint-disable-next-line prefer-destructuring
//       sheet = props.sheet;
//     } else if (props.target) {
//       sheet = sheet.reconstructWithOptions({ target: props.target }, false);
//     }

//     if (props.disableCSSOMInjection) {
//       sheet = sheet.reconstructWithOptions({ useCSSOMInjection: false });
//     }

//     return sheet;
//   }, [props.disableCSSOMInjection, props.sheet, props.target]);

//   const stylis = useMemo(
//     () =>
//       createStylisInstance({
//         options: { prefix: !props.disableVendorPrefixes },
//         plugins,
//       }),
//     [props.disableVendorPrefixes, plugins]
//   );

//   useEffect(() => {
//     if (!shallowequal(plugins, props.stylisPlugins)) setPlugins(props.stylisPlugins);
//   }, [props.stylisPlugins]);

//   return (
//     <StyleSheetContext.Provider value={styleSheet}>
//       <StylisContext.Provider value={stylis}>
//         {process.env.NODE_ENV !== 'production'
//           ? React.Children.only(props.children)
//           : props.children}
//       </StylisContext.Provider>
//     </StyleSheetContext.Provider>
//   );
// }
