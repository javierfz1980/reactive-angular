import {Input, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {StoreData} from "../../../models/core/store-data";
import {ContentService} from "../../../core/providers/services/content/content.service";
import 'rxjs/add/operator/combineLatest';

/**
 * Base class that provide the basic functionalities for interactive list. Interactive lists are list
 * that can be passive (you can not select any row) or actives (you can select multiple rows).
 * This list are used on Courses and Students and Teachers view in order to select which Courses and
 * or Students or Teacher are assigned to each one.
 * The two generic types for this class are Student or Course
 */
export abstract class BasicList<T> implements OnInit {

  /**
   * The list of item that should be marked by default on the list when it is rendered.
   * @param {Observable<string[]>} data
   */
  @Input()
  protected set markedList(data: Observable<string[]>) {
   this._markedList = data;
  }

  /**
   * Flag indicator that determines if the list should be selectable or not.
   * @param {Observable<boolean>} data
   */
  @Input()
  protected set editMode(data: Observable<boolean>) {
    this._editMode = data;
  }

  /**
   * The source of all the items that has to be shown on the list when is on edit mode.
   * @param {Observable<StoreData<T>>} data
   */
  @Input()
  protected set sourceList(data: Observable<StoreData<T>>) {
    this._sourceList = data;
  }

  /**
   * The data source of the list
   */
  protected dataSource: Observable<StoreData<T>>;

  /**
   * The current selection of items. It is a two way binding on the template.
   * @type {any[]}
   */
  protected selection: T[] = [];

  /**
   * The initial grid size before paginating.
   * @type {number}
   */
  protected gridSize: number = 10;

  /**
   * The maximun size of the grid.
   * @type {number}
   */
  protected maxSize: number = this.gridSize;

  private _markedList: Observable<string[]>;
  private _editMode: Observable<boolean>;
  private _sourceList: Observable<StoreData<T>>;
  private initialGridSize = this.gridSize;

  constructor(protected contentService: ContentService) {}

  /**
   * The datasource is combined by 3 different streams:
   * 1- The source
   * 2- The edit mode
   * 3- The marked elements
   */
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

  /**
   * Fetches the contents of the dataSource based on the type of lists.
   * There are only two types of list - Courses or Students.
   * @param {string} type
   */
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

  /**
   * Sets the maximum value for the list.
   * @param {number} value
   */
  private setMaxSize(value: number) {
    this.maxSize = value > 0 ? value : this.gridSize;
  }

  /**
   * Track by function in order to avoid unnecessary DOM refreshes.
   * @param {number} index
   * @param {T} item
   * @returns {string}
   */
  protected trackByItem(index: number, item: T): string {
    return item["id"];
  }

  /**
   * Changes the grid size.
   * @param {number} value
   */
  changeGridSize(value?: number) {
    this.gridSize = value ? value : this.maxSize;
  }

  /**
   * Return the list of items that are currently selected.
   * @returns {string[]}
   */
  getSelecteds(): string[] {
    return this.selection
      .map((item: T) => item["id"]);
  }



}
