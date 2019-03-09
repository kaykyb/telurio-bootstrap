import * as p from "path";

export default class NodeUtil {
  // based on https://stackoverflow.com/a/28214523/10777177
  public static pathToFileUrl(path: string) {
    let pathName = p.resolve(path).replace(/\\/g, "/");

    if (pathName[0] !== "/") {
      pathName = "/" + pathName;
    }

    return encodeURI("file://" + pathName);
  }
}
