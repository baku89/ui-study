import { Vue } from 'vue-property-decorator';
import { DataColorMode, DataColorModeInfo } from '../../data';
export default class InputColorElement extends Vue {
    private color;
    private varying;
    private isEditing;
    private isDragging;
    private slitMaxY;
    private slitMinY;
    private slitLeft;
    private previewY;
    private updatedRecently;
    private updatedTimer;
    private readonly keyFaster;
    readonly mode: DataColorMode;
    readonly element: number;
    readonly cssColor: string;
    readonly slitStyles: {
        left: string;
        top: string;
        height: string;
    };
    readonly previewStyles: {
        background: string;
        left: string;
        top: string;
    };
    readonly info: DataColorModeInfo;
    private onChange;
    private onKeydown;
    private onClick;
    private onDragstart;
    private onDrag;
    private onDragend;
    private onColorChanged;
}
