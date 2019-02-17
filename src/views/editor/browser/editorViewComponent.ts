import ViewComponent from "../../common/viewComponent";
import EditorBrowserService from "./service/editorBrowserService";
import CommonViewBrowserService from "../../common/services/commonViewBrowserService";

export default class EditorViewComponent {
  constructor(public editorService: EditorBrowserService) {}
}
