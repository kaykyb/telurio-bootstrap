export default interface Ii18nLanguage {
  core: {
    settingsSection: {
      appearance: string;
      developer: string;
    };
    settings: {
      colorTheme: {
        label: string;
        desc: string;
      };

      enableDevTools: {
        label: string;
        desc: string;
      };
    };
  };

  editorView: {
    title: string;
    menu: {
      extensionsSubmenu: {
        label: string;
        manageExtensions: string;
      };
      openTelurioDevTools: string;
      openSettingsEditor: string;
    };
  };

  editorDevToolsView: {
    title: string;
    cmdList: {
      permissionLabel: string;
      nonePermission: string;
    };
  };

  marketplaceView: {
    title: string;
    searchBarText: string;
  };

  settingsEditorView: {
    title: string;
    searchBarText: string;
  };
}
