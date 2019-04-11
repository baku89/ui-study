import { Vue } from 'vue-property-decorator';
export default class GradientPalette extends Vue {
    private color;
    private varyings;
    private ctx;
    private canvas;
    private mounted;
    private onColorChanged;
    private onVaryingsChanged;
    private renderPad;
}
