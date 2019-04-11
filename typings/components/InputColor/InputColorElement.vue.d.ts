import { Vue } from 'vue-property-decorator';
export default class InputColorElement extends Vue {
    private value;
    private mode;
    private varying;
    private label;
    private unit;
    private min;
    private max;
    private isEditing;
    private isDragging;
    private slitMaxY;
    private slitMinY;
    private slitLeft;
    private previewY;
    private previewColor;
    readonly element: number;
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
    private onChange;
    private onKeydown;
    private onClick;
    private onDragstart;
    private onDrag;
    private onDragend;
}
