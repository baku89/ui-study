import { Vue } from 'vue-property-decorator';
export default class InputRange extends Vue {
    private value;
    private min;
    private max;
    private step;
    private readonly keySymmetry;
    private readonly keySlower;
    private hoverTarget;
    private dragMode;
    private dragStartValue;
    readonly lower: number;
    readonly upper: number;
    readonly barStyles: {
        left: string;
        right: string;
    };
    readonly firstStyles: {
        left: string;
    };
    readonly secondStyles: {
        left: string;
    };
    private onMousemove;
    private onMouseleave;
    private onDragstart;
    private onDrag;
    private onDragend;
}
