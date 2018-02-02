import {FormGroup} from "@angular/forms";
import {EventEmitter, Input, Output} from "@angular/core";
import {AuthService} from "../../../core/providers/services/auth.service";
import {ProfileBasicInfo} from "../../../models/content/profile-basic-info";

/**
 * The only two types that an info component that is showing info could have.
 */
export type FormType = "create" | "update";

/**
 * Base class that provide the basic functionalities for components that shows info.
 * Components that shows info are used when users are creating or editing Courses, Students and/or
 * Teachers.
 * The two generic types for this class are Course or ProfileBasicInfo (base class of Student or Teacher).
 */
export abstract class BasicInfo<T> {

  /**
   * Event emmited when user is editing an existing Course, Student or Teacher.
   * @type {EventEmitter<T>}
   */
  @Output('update')
  protected updateEvent: EventEmitter<T> = new EventEmitter<T>();

  /**
   * Event emmited when user is creating a new Course, Student or Teacher.
   * @type {EventEmitter<T>}
   */
  @Output('create')
  protected createEvent: EventEmitter<T> = new EventEmitter<T>();

  /**
   * Data that is has to be shown on the component.
   * @param {T} data
   */
  @Input()
  protected set info(data: T) {
    this._info = data;
  }

  /**
   * Input that defines if the component should show the data on edit mode or not.
   * @param {boolean} value
   */
  @Input()
  set isReadOnly(value: boolean) {
    this._isReadOnly = value;
  }

  protected _isReadOnly: boolean;

  /**
   * The type of the info component.
   */
  protected type: FormType;

  /**
   * The type of role for the current user.
   */
  protected isAdministrator: boolean;

  _info: T;

  /**
   * The form group that will contain the data that has to be shown.
   */
  form: FormGroup;

  constructor(protected authService: AuthService) {}

  /**
   * Defines the type of info component and if the current user is Administrator.
   */
  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
    this.type = this._info ? "update" : "create";
  }

  /**
   * Emits an update event.
   */
  protected update() {
    this.updateEvent.emit(this.getData());
  }

  /**
   * Emits a create event.
   */
  protected create() {
    this.createEvent.emit(this.getData());
  }

  /**
   * Returns the current data state.
   * @returns {T}
   */
  protected getData(): T {
    return this.form.value;
  }
}
