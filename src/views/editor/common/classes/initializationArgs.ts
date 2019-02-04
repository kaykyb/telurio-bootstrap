import CommonLayoutConfig from "./commonLayoutConfig";

export default class InitializationArgs {
  public layoutConfig: CommonLayoutConfig;

  constructor(layoutConfig: CommonLayoutConfig) {
    this.layoutConfig = layoutConfig;
  }
}
