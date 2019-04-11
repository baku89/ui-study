import RoteryDrag from './RoteryDrag';
import { DataColor, DataColorMode, DataColorElements } from '../data';
declare function getDOMCenter(el: HTMLElement): number[];
declare function toCSSColor([mode, value]: DataColor): string;
declare function convertColorElements(from: DataColorMode, to: DataColorMode, elements: DataColorElements): DataColorElements;
export { getDOMCenter, toCSSColor, convertColorElements, RoteryDrag };
