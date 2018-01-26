import {OnDestroy} from "@angular/core";

export class BasicSubscriptor implements OnDestroy {

  protected isAlive: boolean = true;

  ngOnDestroy() {
    console.log("componente destruido")
    this.isAlive = false;
  }

}
