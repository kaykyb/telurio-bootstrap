import styles from "./mainView.css";

import Titlebar from "@src/views/common/browser/components/titlebar/titlebar";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import SettingsPage from "./settingsPage/settingsPage";
import CommonEvent from "@src/common/common/commonEvent";
import SettingItem from "./settingsPage/settingItem/settingItem";

export default class MainView {
  public onSectionIntoViewChanged = new CommonEvent<string>();

  private domElement?: HTMLDivElement;

  private titlebar?: Titlebar;
  private settingsPage?: SettingsPage;

  constructor(private readonly commonService: CommonViewBrowserService) {}

  public async render(): Promise<HTMLDivElement> {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.root);

    // titlebar
    this.titlebar = new Titlebar(this.commonService);
    this.titlebar.onClose.addListener(() => {
      this.commonService.close();
    });

    this.domElement.appendChild(await this.titlebar.render());

    // settings page
    this.settingsPage = new SettingsPage(this.commonService);

    // repropagate
    this.settingsPage.onSectionInViewChange.addListener(ev => this.onSectionIntoViewChanged.propagate(ev));

    this.domElement.appendChild(await this.settingsPage.render());

    return this.domElement;
  }

  public scrollSectionIntoView(section: string) {
    if (this.settingsPage) {
      this.settingsPage.scrollSectionIntoView(section);
    }
  }

  public filterSettingsPage(predicate: (x: SettingItem) => boolean) {
    if (!this.settingsPage) {
      return;
    }

    this.settingsPage.filterSettings(predicate);
  }
}
