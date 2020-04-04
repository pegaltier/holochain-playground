import { Observable, Subscription, Subscriber } from "rxjs";
import { map } from "rxjs/operators";

import { Dictionary } from "../types/common";

export class Blackboard<S extends Dictionary<any>> {
  private subscriber: Subscriber<S>;
  private observable: Observable<S>;

  constructor(public state: S) {
    this.observable = new Observable<S>((subscriber) => {
      this.subscriber = subscriber;
      this.subscriber.next(state);
    });
  }

  subscribe(
    next: (value: S) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return this.observable.subscribe(next, error, complete);
  }

  select(selector: string | ((state: S) => any)): Observable<any> {
    return this.observable.pipe(
      map((state) => {
        if (typeof selector === "string") {
          return state[selector];
        }
        return selector(state);
      })
    );
  }

  update(key: keyof S, value: any): void {
    this.state[key] = value;
    this.subscriber.next(this.state);
  }
}
