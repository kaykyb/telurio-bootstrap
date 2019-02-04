export default class CommonEvent<T> {
  private listeners: Array<(event: T) => any> = [];

  public addListener(listener: (event: T) => any) {
    this.listeners.push(listener);
  }

  public removeListener(listener: (event: T) => any) {
    this.listeners.forEach((v, i) => {
      if (v === listener) {
        this.listeners.splice(i, 1);
      }
    });
  }

  public propagate(event: T) {
    this.listeners.forEach(listener => {
      listener(event);
    });
  }
}
