import { Vue } from 'vue-property-decorator';
export default class SvgArcArrow extends Vue {
    private center;
    private radius;
    private start;
    private end;
    readonly diff: number;
    readonly startRadians: number;
    readonly endRadians: number;
    readonly x2: number;
    readonly y2: number;
    readonly d: string;
    readonly willShowTip: boolean;
    readonly tipTransform: string;
}
