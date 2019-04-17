import { Vue } from 'vue-property-decorator';
export default class InputAngle extends Vue {
    private value;
    private isDragging;
    private dragFrom;
    private dragTo;
    private roteryDrag;
    private readonly quantizeAngles;
    private readonly keyQuantize;
    private created;
    private mounted;
    private onDragstart;
    private onDrag;
    private onDragend;
}
