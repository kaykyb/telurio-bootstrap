export default class Tab {
  constructor(
    public panelId: string,
    public panelTitle: string,
    public args?: any,
    public active: boolean = false
  ) {}
}
