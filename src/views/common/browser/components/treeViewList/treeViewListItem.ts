export default class TreeViewListItem {
  constructor(
    public label: string,
    public id: string,
    public isSelected: boolean,
    public icon?: string,
    public sublist?: TreeViewListItem[]
  ) {}
}
