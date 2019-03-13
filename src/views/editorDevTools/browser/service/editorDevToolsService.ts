import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import { EDITOR_DEV_TOOLS_IPC_CHANNELS } from "../../common/editorDevToolsIpcChannels";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import CommonEvent from "@src/common/common/commonEvent";
import IpcBrowserService from "@src/common/browser/services/ipc/ipcBrowserService";
import IEditorIpcArgs from "@src/views/editor/common/ipc/EditorIpcServiceArgs";
import ICommandIndex from "@src/common/common/extensions/commandIndex";
import IEditorDevToolsIpcArgs from "../../common/ipc/editorDevToolsIpcArgs";
import IEditorDevToolsIpcReturns from "../../common/ipc/editorDevToolsIpcReturns";

export default class EditorDevToolsBrowserService {
  public onExtCommandsUpdate = new CommonEvent<ICommandIndex>();

  private ipcService = new IpcBrowserService<IEditorDevToolsIpcArgs, IEditorDevToolsIpcReturns>(
    "EDITOR_DEVTOOLS"
  );

  constructor(public commonService: CommonViewBrowserService) {}

  public async getEditorCommands(): Promise<ICommandIndex> {
    this.ipcService.addListener("UPDATE_EXT_COMMANDS", cmds => this.onExtCommandsUpdate.propagate(cmds));
    return this.ipcService.sendAndReturn("GET_EXT_COMMANDS");
  }
}
