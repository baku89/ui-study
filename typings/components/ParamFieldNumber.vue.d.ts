import { Vue } from 'vue-property-decorator';
export default class ParamFieldNumber extends Vue {
    private value;
    private min;
    private max;
    private precision;
    private label;
    private unit;
    private onInput;
}
