import { Vue } from 'vue-property-decorator';
export default class InputNumber extends Vue {
    private value;
    private precision;
    private label;
    private unit;
    private min;
    private max;
    private isEditing;
    private isDragging;
    private dragFrom;
    private dragTo;
    private dragMinX;
    private dragMaxX;
    private readonly dragSpeed;
    private readonly displayValue;
    private readonly hasMin;
    private readonly hasMax;
    private onChange;
    private onClick;
    private onKeydown;
    private onDragstart;
    private onDrag;
    private onDragend;
}
