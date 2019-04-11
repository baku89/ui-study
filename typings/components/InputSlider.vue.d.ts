import { Vue } from 'vue-property-decorator';
export default class InputSlider extends Vue {
    private value;
    private min;
    private max;
    private knobOffset;
    private isDragging;
    private readonly percent;
    private readonly accumStyles;
    private readonly knobStyles;
    private readonly isExceeded;
    private readonly zeroStyles;
    private onDragstart;
    private onDrag;
    private onDragend;
}
