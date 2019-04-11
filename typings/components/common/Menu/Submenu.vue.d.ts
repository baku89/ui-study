import { Vue } from 'vue-property-decorator';
export default class Submenu extends Vue {
    private items;
    private type;
    private hasParent;
    private selectedIndex;
    private isSubSelected;
    setSelectedIndex(index: number | null): void;
    private onItemsChanged;
    private liClasses;
    private onHoverItem;
    private mounted;
    private beforeDestroy;
    private onKeydown;
    private selectNeighbour;
}
