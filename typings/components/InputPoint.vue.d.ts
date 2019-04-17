import { Vue } from 'vue-property-decorator';
export default class InputPoint extends Vue {
    private value;
    private knobOffset;
    private isDragging;
    private dragFrom;
    private dragTo;
    private readonly keyFaster;
    private readonly keySlower;
    private ui;
    private onKeydown;
    private onKeyup;
    private onDragstart;
    private onDrag;
    private onDragend;
}
