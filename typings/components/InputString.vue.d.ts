import { Vue } from 'vue-property-decorator';
export default class InputString extends Vue {
    private value;
    private validator;
    readonly inputListeners: Record<string, Function | Function[]> & {
        change: () => void;
    };
    private onChange;
}
