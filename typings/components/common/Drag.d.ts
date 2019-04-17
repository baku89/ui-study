import { Vue } from 'vue-property-decorator';
export default class Drag extends Vue {
    private measure;
    private coordinate;
    private detectDirection;
    private minDragDistance;
    private clamp;
    private box;
    private dragStarted;
    private origin;
    private current;
    private prev;
    private delta;
    private absOrigin;
    private absCurrent;
    private absPrev;
    private created;
    private mounted;
    private beforeDestroy;
    private readonly boxElement;
    private onMousedown;
    private onKeyToggle;
    private onMousemove;
    private onMouseup;
    private quitDrag;
    private setAbsCoordByMouseEvent;
    private toSpecifiedCoord;
    private render;
}
