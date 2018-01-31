import {Input, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {StoreData} from "../../../models/core/store-data";
import {ContentService} from "../../../core/providers/services/content/content.service";
import 'rxjs/add/operator/combineLatest';

export abstract class BasicList<T> implements OnInit {

  @Input()
  protected set markedList(data: Observable<string[]>) {
   this._markedList = data;
  }

  @Input()
  protected set editMode(data: Observable<boolean>) {
    this._editMode = data;
  }

  @Input()
  protected set sourceList(data: Observable<StoreData<T>>) {
    this._sourceList = data;
  }

  protected dataSource: Observable<StoreData<T>>;
  protected selection: T[] = [];
  protected gridSize: number = 10;
  protected maxSize: number = this.gridSize;

  private _markedList: Observable<string[]>;
  private _editMode: Observable<boolean>;
  private _sourceList: Observable<StoreData<T>>;
  private initialGridSize = this.gridSize;

  constructor(protected contentService: ContentService) {}

  ngOnInit() {
    this.dataSource = this._sourceList
      .combineLatest(
        this._markedList,
        this._editMode)
      .map(([storeData, marked, editMode]) => {
        if (!storeData.data) storeData.data = [];
        this.selection = storeData.data
          .filter((item: T) => marked && marked
            .some((markedItem: string) => markedItem === item["id"])
          );
        this.gridSize = this.initialGridSize;
        if (editMode) {
          this.setMaxSize(storeData.data.length);
          this.changeGridSize(storeData.data.length > this.gridSize ? this.gridSize : storeData.data.length);
          return storeData;
        }
        const res: T[] = this.selection.slice();
        this.selection = null;
        this.setMaxSize(res.length);
        this.changeGridSize(res.length > this.gridSize ? this.gridSize : res.length);
        return {data: res, loading: storeData.loading};
      });

    this.fetchContent(this.constructor.name);
  }

  private fetchContent(type: string) {
    switch (type) {
      case "StudentsListComponent":{
        this.contentService.fetchStudents();
        return;
      }
      case "CoursesListComponent":{
        this.contentService.fetchCourses();
        return;
      }
    }
  }

  private setMaxSize(value: number) {
    this.maxSize = value > 0 ? value : this.gridSize;
  }

  protected trackByItem(index: number, item: T): string {
    return item["id"];
  }

  changeGridSize(value?: number) {
    this.gridSize = value ? value : this.maxSize;
  }

  getSelecteds(): string[] {
    return this.selection
      .map((item: T) => item["id"]);
  }



}
