import CommonViewBrowserService from "@src/views/common/services/commonViewBrowserService";
import { EDITOR_DEV_TOOLS_IPC_CHANNELS } from "../../common/editorDevToolsIpcChannels";
import { EditorExtensionBridgeCommand } from "@src/views/editor/browser/service/editorExtensionBridge";

export default class EditorDevToolsBrowserService {
  constructor(public commonService: CommonViewBrowserService) {}

  public async getEditorCommands(): Promise<{ [key: string]: EditorExtensionBridgeCommand }> {
    return new Promise<{ [key: string]: EditorExtensionBridgeCommand }>(resolve => {
      if (this.commonService.ipcService.ipc) {
        const ipc = this.commonService.ipcService.ipc;

        ipc.once(
          EDITOR_DEV_TOOLS_IPC_CHANNELS.GET_EXT_COMMANDS_RETURN,
          (event: Electron.Event, cmd: { [key: string]: EditorExtensionBridgeCommand }) => {
            resolve(cmd);
          }
        );

        ipc.send(EDITOR_DEV_TOOLS_IPC_CHANNELS.GET_EXT_COMMANDS);
      }
    });
  }
}
