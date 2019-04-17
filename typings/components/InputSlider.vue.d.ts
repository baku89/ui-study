import { Vue } from 'vue-property-decorator';
export default class InputSlider extends Vue {
    private value;
    private min;
    private max;
    private step;
    private readonly keySlower;
    private dragStartValue;
    private isDragging;
    private readonly percent;
    private readonly accumStyles;
    private readonly knobStyles;
    private readonly isExceeded;
    private onDragstart;
    private onDrag;
    private onDragend;
}
