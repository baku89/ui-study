import { Vue } from 'vue-property-decorator';
export default class Portal extends Vue {
    private originalParentEl;
    private attachToParent;
    private target;
    private mounted;
    private beforeDestroy;
    private render;
    private onTargetChanged;
    private killGhostElement;
    private initDestroy;
    private destroyElement;
    private changeParentEl;
}
