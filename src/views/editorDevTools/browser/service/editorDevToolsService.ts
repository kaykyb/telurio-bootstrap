import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import { EDITOR_DEV_TOOLS_IPC_CHANNELS } from "../../common/editorDevToolsIpcChannels";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import CommonEvent from "@src/common/common/commonEvent";

export default class EditorDevToolsBrowserService {
  public onExtCommandsUpdate = new CommonEvent<{ [key: string]: EditorExtensionBridgeCommand<any> }>();

  constructor(public commonService: CommonViewBrowserService) {}

  public async getEditorCommands(): Promise<{ [key: string]: EditorExtensionBridgeCommand<any> }> {
    return new Promise<{ [key: string]: EditorExtensionBridgeCommand<any> }>(resolve => {
      if (this.commonService.ipcService.ipc) {
        const ipc = this.commonService.ipcService.ipc;

        ipc.once(
          EDITOR_DEV_TOOLS_IPC_CHANNELS.GET_EXT_COMMANDS_RETURN,
          (event: Electron.Event, cmd: { [key: string]: EditorExtensionBridgeCommand<any> }) => {
            resolve(cmd);
          }
        );

        ipc.on(
          EDITOR_DEV_TOOLS_IPC_CHANNELS.UPDATE_EXT_COMMANDS,
          (event: Electron.Event, cmds: { [key: string]: EditorExtensionBridgeCommand<any> }) => {
            this.onExtCommandsUpdate.propagate(cmds);
          }
        );

        ipc.send(EDITOR_DEV_TOOLS_IPC_CHANNELS.GET_EXT_COMMANDS);
      }
    });
  }
}
