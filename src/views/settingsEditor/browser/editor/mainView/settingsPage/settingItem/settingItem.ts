import styles from "./settingItem.css";

import SettingMetadata from "@src/common/node/services/settings/settingMetadata";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import Switch from "@src/views/common/browser/components/switch/switch";

export default class SettingItem {
  private domElement?: HTMLDivElement;

  private readonly settingKey: string;

  constructor(
    public owner: ExtensionManifest,
    public setting: SettingMetadata<
      "boolean" | "booleanArr" | "number" | "numberArr" | "string" | "stringArr"
    >,
    private readonly commonService: CommonViewBrowserService
  ) {
    this.settingKey = this.owner.name + "." + this.setting.name;
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.settingItem);

    // setting label
    const labelArea = document.createElement("div");
    labelArea.classList.add(styles.labelArea);

    const label = document.createElement("div");
    label.classList.add(styles.label);

    const locLabelText = this.setting.label.find(l => l.lang === this.commonService.i18n.language.code);
    const enLabelText = this.setting.label.find(l => l.lang === "en");
    const firstLabelText = this.setting.label[0];

    label.textContent =
      (locLabelText && locLabelText.content) ||
      (enLabelText && enLabelText.content) ||
      firstLabelText.content;

    labelArea.appendChild(label);
    this.domElement.appendChild(labelArea);

    // setting desc
    this.addDescription();

    // add editor
    switch (this.setting.type) {
      case "string":
        this.addStringEditor();
        break;

      case "boolean":
        this.addBooleanSettingEditor();
        break;

      default:
        break;
    }

    return this.domElement;
  }

  public show() {
    if (!this.domElement) {
      return;
    }

    if (this.domElement.classList.contains(styles.hidden)) {
      this.domElement.classList.remove(styles.hidden);
    }
  }

  public hide() {
    if (!this.domElement) {
      return;
    }

    if (!this.domElement.classList.contains(styles.hidden)) {
      this.domElement.classList.add(styles.hidden);
    }
  }

  private addDescription() {
    if (!this.domElement) {
      return;
    }

    if (!this.setting.description) {
      return;
    }

    const desc = document.createElement("div");
    desc.classList.add(styles.desc);

    const locDescText = this.setting.description.find(l => l.lang === this.commonService.i18n.language.code);
    const enDescText = this.setting.description.find(l => l.lang === "en");
    const firstDescText = this.setting.description[0];

    desc.textContent =
      (locDescText && locDescText.content) || (enDescText && enDescText.content) || firstDescText.content;

    this.domElement.appendChild(desc);
  }

  private addStringEditor() {
    if (!this.domElement) {
      return;
    }

    if (this.setting.type !== "string") {
      return;
    }

    const stringEditorContainer = document.createElement("div");
    stringEditorContainer.classList.add(styles.stringEditorContainer);

    const input = document.createElement("input");
    input.classList.add(styles.stringEditor);

    input.value = this.getSettingValue();

    input.addEventListener("blur", ev => {
      this.commonService.userSettings.setSetting(this.settingKey, input.value);
    });

    stringEditorContainer.appendChild(input);

    this.domElement.appendChild(stringEditorContainer);
  }

  private addBooleanSettingEditor() {
    if (!this.domElement) {
      return;
    }

    if (this.setting.type !== "boolean") {
      return;
    }

    const stringEditorContainer = document.createElement("div");
    stringEditorContainer.classList.add(styles.stringEditorContainer);

    const input = new Switch(this.getSettingValue());
    stringEditorContainer.appendChild(input.render());

    input.onToggle.addListener(newValue => {
      this.commonService.userSettings.setSetting(this.settingKey, newValue);
    });

    this.domElement.appendChild(stringEditorContainer);
  }

  private getSettingValue(): any {
    const settingKey = this.owner.name + "." + this.setting.name;

    if (this.commonService.userSettings.containsSetting(settingKey)) {
      return this.commonService.userSettings.getSetting(settingKey);
    }

    return this.setting.defaultValue;
  }

  // public getBooleanSettingEditor(): HTMLDivElement {}
}
