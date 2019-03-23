export default class ContextMenuItem {
  constructor(
    public label: string,
    public callback?: () => void,
    public subitems?: ContextMenuItem[],
    public icon?: string,
    public shortcut?: string
  ) {}
}
