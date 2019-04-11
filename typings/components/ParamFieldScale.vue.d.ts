import { Vue } from 'vue-property-decorator';
export default class ParamFieldScale extends Vue {
    private value;
    private min;
    private max;
    private precision;
    private labels;
    private keepProportion;
    private internalKeepProportion;
    private created;
    private readonly _keepProportion;
    private onInput;
    private onChangeKeepProportion;
}
