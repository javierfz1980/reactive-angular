import {OnDestroy} from "@angular/core";

/**
 * Base class tha should be extended by any class that want to have a flag indicating if the component
 * is still alive. This is useful to handle Observable subscriptions in order to unsubscribe. Instead
 * of doing unsubscribe() you can use operator .takeWhile(() => this.isAlive).
 */
export class BasicSubscriptor implements OnDestroy {

  protected isAlive: boolean = true;

  ngOnDestroy() {
    this.isAlive = false;
  }

}
