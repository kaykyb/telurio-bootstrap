export default class ExtensionCommandActivationArgs {
  constructor(public cmd: string, public args: any[], public returnCmdId?: string) {}
}
