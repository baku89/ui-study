import { Vue } from 'vue-property-decorator';
import { DataColorMode, DataColorElements } from '../data';
export default class InputColorButton extends Vue {
    private value;
    private isPopoverOpen;
    readonly mode: DataColorMode;
    readonly elements: DataColorElements;
    readonly cssColor: string;
    readonly previewStyles: object;
    readonly hsl: number[];
    private onChangeMode;
    private onInput;
}
