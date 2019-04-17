import { Vue } from 'vue-property-decorator';
export default class InputColor extends Vue {
    private value;
    private showLabel;
    private readonly hasAlpha;
    private readonly isHex;
    private validateColorHex;
    private onUpdateElement;
}
