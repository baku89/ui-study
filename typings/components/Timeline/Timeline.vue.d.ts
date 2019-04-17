import { Vue } from 'vue-property-decorator';
export default class Timeline extends Vue {
    private time;
    private min;
    private max;
    private autoScroll;
    private readonly keyScale;
    private displayRange;
    private readonly keySlower;
    private dragStartTime;
    private created;
    private mounted;
    private readonly knobOverflow;
    private readonly knobStyles;
    private onDragstart;
    private onDrag;
    private onUpdateDisplayRange;
    private onTimeChanged;
    private scrollToTime;
}
