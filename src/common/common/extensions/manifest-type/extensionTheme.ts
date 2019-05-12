export default class ExtensionTheme {
  /**
   * The UNSAFE theme provided by the extension
   * @param name The unsafe name provided by the extension.
   * @param type The unsafe type provided by the extension.
   * @param file The unsafe file provided by the extension.
   * @param label The unsafe label provided by the extension.
   */
  constructor(
    public name?: string,
    public type?: "dark" | "light",
    public file?: string,
    public label?: string
  ) {}
}
