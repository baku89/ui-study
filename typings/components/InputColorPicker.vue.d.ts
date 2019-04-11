import { Vue } from 'vue-property-decorator';
export default class InputColorPicker extends Vue {
    private value;
    private isDraggingSL;
    private isDraggingHue;
    private readonly mode;
    private readonly elements;
    private readonly hsl;
    private readonly cssColor;
    private readonly SLPreviewStyles;
    private readonly HuePreviewStyles;
    private readonly gradientPaletteColor;
    private onDragSL;
    private onDragHue;
    private emitNewHSL;
}
