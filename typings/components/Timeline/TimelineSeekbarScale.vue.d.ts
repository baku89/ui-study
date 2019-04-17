import { Vue } from 'vue-property-decorator';
export default class TimelineSeekbarScale extends Vue {
    private displayRange;
    private readonly fps;
    private scales;
    private mounted;
    private updateScale;
}
