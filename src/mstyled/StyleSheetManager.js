import StyleSheet from './StyleSheet';

export const masterSheet = new StyleSheet();

export function useStyleSheet() {
  return  masterSheet;
}

