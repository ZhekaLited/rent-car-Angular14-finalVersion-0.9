import { Component, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Component({
  template: ''
})
export abstract class ComponentBase implements OnDestroy {

  protected unsubscribe: Subject<void> = new Subject();

  public ngOnDestroy(): void {
    if (!this.unsubscribe) {
      return;
    }

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public unsubscribeAsObservable: Observable<void> = this.unsubscribe.asObservable();
}
