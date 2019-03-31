export default interface Ii18nLanguage {
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
