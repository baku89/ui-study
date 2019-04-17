import { Vue } from 'vue-property-decorator';
export default class InputVector extends Vue {
    private value;
    private precision;
    private min;
    private max;
    private step;
    private labels;
    private unit;
    private onInput;
}
