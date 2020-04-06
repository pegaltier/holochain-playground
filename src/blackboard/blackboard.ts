import { Observable, Subscription, Subscriber, Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Dictionary } from "../types/common";

export class Blackboard<S extends Dictionary<any>> {
  private subject: Subject<S>;

  constructor(protected _state: S) {
    this.subject = new Subject<S>();
    this.subject.next(_state);
  }

  get state(): S {
    return this._state;
  }

  subscribe(
    next: (value: S) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return this.subject.subscribe(next, error, complete);
  }

  select(selector: string | ((state: S) => any)): Observable<any> {
    return this.subject.pipe(
      map((state) => {
        if (typeof selector === "string") {
          return state[selector];
        }
        return selector(state);
      })
    );
  }

  update(key: keyof S, value: any): void {
    this._state[key] = value;
    this.subject.next(this._state);
  }

  updateState(state: S): void {
    this._state = state;
    this.subject.next(this._state);
  }
}
