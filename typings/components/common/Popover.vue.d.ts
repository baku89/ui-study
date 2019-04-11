import { Vue } from 'vue-property-decorator';
export default class Popover extends Vue {
    private active;
    private placement;
    private popperInstance;
    private originalParentEl;
    private mounted;
    private onActiveChanged;
    private setOriginalParent;
    private killPopper;
    private bindPopper;
    private createPopper;
    private resetPopper;
}
