import RoteryDrag from './RoteryDrag';
import keypressed from './keypressed';
import { DataColor, DataColorMode, DataColorElements } from '../data';
declare function getDOMCenter(el: HTMLElement): number[];
declare function setButtonUnfocusableForMouse(button: HTMLElement): void;
declare function toCSSColor(color: DataColor): string;
declare function convertColorElements(from: DataColorMode, to: DataColorMode, elements: DataColorElements): DataColorElements;
export { getDOMCenter, setButtonUnfocusableForMouse, toCSSColor, convertColorElements, RoteryDrag, keypressed };
