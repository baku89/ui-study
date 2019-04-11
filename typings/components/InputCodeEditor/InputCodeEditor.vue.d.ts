import { Vue } from 'vue-property-decorator';
export default class InputCodeEditor extends Vue {
    private value;
    private lang;
    private editor;
    private mounted;
    private beforeDestroy;
    private onValueChanged;
    private onLangChanged;
}
