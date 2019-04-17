import { Vue } from 'vue-property-decorator';
import { vec2 } from 'gl-matrix';
export default class SvgArrow extends Vue {
    private from;
    private to;
    private _sub;
    private _lineTo;
    private _normalized;
    private created;
    readonly lineTo: vec2;
    readonly sub: vec2;
    readonly willShowTip: boolean;
    readonly tipTransform: string;
}
