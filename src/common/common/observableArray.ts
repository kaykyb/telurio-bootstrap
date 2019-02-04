import CommonEvent from "./commonEvent";

export class ObservableArrayEvent {
  public targetIndex?: number;

  constructor(targetIndex?: number) {
    this.targetIndex = targetIndex;
  }
}

// tslint:disable-next-line:max-classes-per-file
export default class ObservableArray<T> {
  public static fromArray<T>(arr: T[]): ObservableArray<T> {
    const v = new ObservableArray<T>();
    arr.forEach(e => {
      v.push(e);
    });
    return v;
  }

  public onBeforeSet = new CommonEvent<ObservableArrayEvent>();
  public onAfterSet = new CommonEvent<ObservableArrayEvent>();

  public onBeforePush = new CommonEvent<ObservableArrayEvent>();
  public onAfterPush = new CommonEvent<ObservableArrayEvent>();

  public onBeforeDelete = new CommonEvent<ObservableArrayEvent>();
  // public onAfterDelete = new CommonEvent<ObservableArrayEvent>(); --> Sem sentido.

  public onBeforeReplace = new CommonEvent<ObservableArrayEvent>();
  public onAfterReplace = new CommonEvent<ObservableArrayEvent>();

  private primitiveArray = new Array<T>();

  // tslint:disable
  // Metódos do array que não sofrerão override
  public indexOf = this.primitiveArray.indexOf;
  public lastIndexOf = this.primitiveArray.lastIndexOf;
  public pop = this.primitiveArray.pop;
  // tslint:enable

  public get length(): number {
    return this.primitiveArray.length;
  }

  //#region Array Methods Overrides
  public get(index: number) {
    return this.primitiveArray[index];
  }

  public set(index: number, value: T) {
    this.onBeforeSet.propagate(new ObservableArrayEvent(index));
    this.primitiveArray[index] = value;
    this.onAfterSet.propagate(new ObservableArrayEvent(index));
  }

  public push(value: T): number {
    this.onBeforePush.propagate(new ObservableArrayEvent(undefined));
    const length = this.primitiveArray.push(value);
    this.onAfterPush.propagate(new ObservableArrayEvent(length - 1));

    return length;
  }

  public forEach(callbackfn: (value: T, index: number, array: ObservableArray<T>) => void, thisArg?: any): void {
    return this.primitiveArray.forEach((v, i) => callbackfn(v, i, this), thisArg);
  }
  //#endregion Array Methods Overrides
  //#region Custom Array Methods

  /**
   * Returns the index of the first ocurrence where the predicates returns true.
   * If no match was found returns -1.
   * @param predicate The function to test the objects
   * @returns An index on this array or -1.
   */
  public first(predicate: (x: T) => boolean): number {
    for (let i = 0; i < this.primitiveArray.length; i++) {
      const element = this.primitiveArray[i];
      if (predicate(element)) {
        return i;
      }
    }

    return -1;
  }

  public delete(start: number, deleteCount?: number): T[] {
    const delCount = deleteCount ? deleteCount : this.primitiveArray.length - start;
    for (let index = 0; index < delCount; index++) {
      this.onBeforeDelete.propagate(new ObservableArrayEvent(index + start));
    }

    return this.primitiveArray.splice(start, deleteCount);
  }

  public replace(start: number, deleteCount: number, ...items: T[]): T[] {
    const delCount = deleteCount ? deleteCount : this.primitiveArray.length - start;
    for (let index = 0; index < delCount; index++) {
      this.onBeforeReplace.propagate(new ObservableArrayEvent(index));
    }

    const v = this.primitiveArray.splice(start, deleteCount, ...items);

    for (let index = 0; index < delCount; index++) {
      this.onAfterReplace.propagate(new ObservableArrayEvent(index));
    }

    return v;
  }
  //#endregion Custom Array Methods

  // public splice(start: number, deleteCount: number, ...items: T[]): T[] {
  //   return this.array.splice(start, deleteCount, ...items);
  // }
}
