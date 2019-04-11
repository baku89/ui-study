import { Vue } from 'vue-property-decorator';
export default class Menu extends Vue {
    private items;
    private filterText;
    private readonly isFiltering;
    private readonly numValues;
    private readonly flattenedItems;
    private readonly filteredItems;
    private mounted;
    private beforeDestroy;
    private onKeydown;
    private onInputFilterText;
    private onKeydownFilterText;
}
