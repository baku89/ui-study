import { Vue } from 'vue-property-decorator';
export default class InputColorPicker extends Vue {
    private value;
    private isDraggingSV;
    private isDraggingHue;
    private readonly mode;
    private readonly elements;
    private readonly hsv;
    private readonly cssColor;
    private readonly SVPreviewStyles;
    private readonly HuePreviewStyles;
    private readonly gradientPaletteColor;
    private onDragSV;
    private onDragHue;
    private emitNewValue;
}
