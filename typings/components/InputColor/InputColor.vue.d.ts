import { Vue } from 'vue-property-decorator';
export default class InputColor extends Vue {
    private value;
    private showLabel;
    private readonly elementMax;
    private readonly elementLabels;
    private readonly elementUnits;
    private readonly hasAlpha;
    private readonly isHex;
    private validateColorHex;
    private onInputElement;
}
