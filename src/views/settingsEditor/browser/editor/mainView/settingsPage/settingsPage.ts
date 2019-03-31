import styles from "./settingsPage.css";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import SettingItem from "./settingItem/settingItem";
import SettingMetadata from "@src/common/node/services/settings/settingMetadata";
import StringUtil from "@src/common/common/util/stringUtil";
import CommonEvent from "@src/common/common/commonEvent";
import ScrollableElement from "@src/views/common/browser/components/scrollable-element/scrollableElement";

export default class SettingsPage {
  public onSectionInViewChange = new CommonEvent<string>();

  private sections = new Map<string, HTMLDivElement>();
  // private sectionsOffsets = new Map<string, number>();

  private offsetsCollected = false;

  private domElement?: HTMLDivElement;

  private containerElement?: HTMLDivElement;
  private lastSectionInView = "";

  private items: SettingItem[] = [];

  constructor(private readonly commonService: CommonViewBrowserService) {
    this.handleScroll = this.handleScroll.bind(this);
    // this.collectSectionsOffsets = this.collectSectionsOffsets.bind(this);
  }

  public async render(): Promise<HTMLDivElement> {
    const exts = await this.commonService.getExtensions();

    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.scrollContainer);

    this.containerElement = document.createElement("div");
    this.containerElement.classList.add(styles.settingsContainer);

    exts.forEach(ext => {
      this.addSettings(ext.extension);
    });

    this.containerElement.addEventListener("scroll", this.handleScroll);
    requestAnimationFrame(this.handleScroll);

    const scrollableElement = new ScrollableElement(this.containerElement, "y");
    this.domElement.appendChild(scrollableElement.render());

    // requestAnimationFrame(this.collectSectionsOffsets);

    return this.domElement;
  }

  public getSectionInView(): string {
    // if (!this.offsetsCollected) {
    //   return "";
    // }

    for (const section of this.sections) {
      if (this.isSectionInView(section[0])) {
        return section[0];
      }
    }

    return "";
  }

  public scrollSectionIntoView(section: string) {
    if (!this.containerElement) {
      return;
    }

    const sectionDiv = this.sections.get(section);

    if (sectionDiv) {
      this.containerElement.scroll({
        behavior: "smooth",
        top: sectionDiv.offsetTop
      });
    }
  }

  public isSectionInView(section: string): boolean {
    const div = this.sections.get(section);

    if (!div) {
      return false;
    }

    const divBoundingRect = div.getBoundingClientRect();
    const domElementBoundingRect = this.containerElement!.getBoundingClientRect();

    return (
      divBoundingRect.top - domElementBoundingRect.top < domElementBoundingRect.height / 2 &&
      divBoundingRect.top - domElementBoundingRect.top + divBoundingRect.height >=
        domElementBoundingRect.height / 2
    );
  }

  public filterSettings(predicate: (x: SettingItem) => boolean) {
    this.items.forEach(i => {
      if (predicate(i)) {
        i.show();
        return;
      }

      i.hide();
    });
  }

  private handleScroll() {
    const sectionInView = this.getSectionInView();

    if (sectionInView !== this.lastSectionInView) {
      this.lastSectionInView = sectionInView;
      this.onSectionInViewChange.propagate(sectionInView);
    }
  }

  // private collectSectionsOffsets() {
  //   this.sections.forEach((v, k) => {
  //     this.sectionsOffsets.set(k, v.getBoundingClientRect().top);
  //   });

  //   this.offsetsCollected = true;
  // }

  private addSettings(ext: ExtensionManifest) {
    if (!ext.contributions) {
      return;
    }

    if (!ext.contributions.settings) {
      return;
    }

    const extSection = document.createElement("div");
    extSection.classList.add(styles.extSection);

    const extSectionLabel = document.createElement("div");
    extSectionLabel.classList.add(styles.extSectionLabel);
    extSectionLabel.innerText = ext.label;

    extSection.appendChild(extSectionLabel);

    this.sections.set(ext.name, extSectionLabel);

    const uncategorizedSettings = ext.contributions.settings.filter(s => !s.section);
    if (uncategorizedSettings) {
      this.addSettingsSection(ext, uncategorizedSettings, extSection, "");
    }

    if (!ext.contributions.settingsSections) {
      return;
    }

    ext.contributions.settingsSections.forEach(section => {
      const sectionSettings = ext.contributions!.settings!.filter(s => s.section === section.name);
      if (sectionSettings) {
        this.addSettingsSection(
          ext,
          sectionSettings,
          extSection,
          ext.name + "." + section.name,
          StringUtil.getAppropriateLabel(section.label, this.commonService.i18n.language.code).content
        );
      }
    });

    this.containerElement!.appendChild(extSection);
  }

  private addSettingsSection(
    ext: ExtensionManifest,
    settings: Array<SettingMetadata<any>>,
    container: HTMLElement,
    id: string,
    label?: string
  ) {
    const sectionContainer = document.createElement("div");
    sectionContainer.classList.add(styles.section);

    if (label) {
      const sectionLabel = document.createElement("div");
      sectionLabel.classList.add(styles.sectionLabel);

      sectionLabel.innerText = label;

      sectionContainer.appendChild(sectionLabel);
    }

    settings.forEach(setting => {
      const settingItem = new SettingItem(ext, setting, this.commonService);
      this.items.push(settingItem);
      sectionContainer.appendChild(settingItem.render());
    });

    sectionContainer.id = id;
    this.sections.set(id, sectionContainer);

    container.appendChild(sectionContainer);
  }
}
