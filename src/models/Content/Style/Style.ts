import { Colors } from './Color';
import { Font } from './Font';

export interface Style {
  font: Font;
  colors: Colors;
  customCss: string;
  textColorPrimary: string;
  textColorSecondary: string;
  showBlackWeglowLogo: boolean;
}
