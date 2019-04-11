import { Vue } from 'vue-property-decorator';
export default class InputMatrix extends Vue {
    private value;
    private columns;
    private rows;
    private direction;
    private precision;
    private min;
    private max;
    private labels;
    private unit;
    private readonly elmAttrs;
    private onInput;
}
