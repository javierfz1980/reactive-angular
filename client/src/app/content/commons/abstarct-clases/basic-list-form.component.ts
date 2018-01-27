import {Input, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/combineLatest';

export abstract class BasicListFormComponent<T> implements OnInit {

  @Input()
  protected set markedList(data: Observable<string[]>) {
   this._markedList = data ? data : Observable.of([]);
  }

  @Input()
  protected set editMode(data: Observable<boolean>) {
    this._editMode = data ? data : Observable.of(false);
  }

  @Input()
  protected set sourceList(data: Observable<T[]>) {
    this._sourceList = data ? data : Observable.of([]);
  }

  protected stream: Observable<any>;
  protected selection: T[] = [];

  private _markedList: Observable<string[]>;
  private _editMode: Observable<boolean>;
  private _sourceList: Observable<T[]>;

  ngOnInit() {
    this.stream = this._sourceList
      .combineLatest(
        this._markedList,
        this._editMode);
  }

  getSelecteds(): string[] {
    return this.selection
      .map((item: T) => item["id"]);
  }

  protected trackByItem(index: number, item: T): string {
    return item["id"];
  }

}
