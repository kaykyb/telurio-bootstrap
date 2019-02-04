export default class TrackableEvent<T, S> {
  private listeners: Array<(event: T, sender: S) => any> = [];

  public addListener(listener: (event: T, sender: S) => any) {
    this.listeners.push(listener);
  }

  public removeListener(listener: (event: T, sender: S) => any, firstOnly = false) {
    if (firstOnly) {
      for (let i = 0; i < this.listeners.length; i++) {
        const element = this.listeners[i];
        if (listener === element) {
          this.listeners.splice(i, 1);
          break;
        }
      }
    } else {
      this.listeners.forEach((v, i) => {
        if (v === listener) {
          this.listeners.splice(i, 1);
        }
      });
    }
  }

  public propagate(event: T, sender: S) {
    this.listeners.forEach(listener => {
      listener(event, sender);
    });
  }
}
