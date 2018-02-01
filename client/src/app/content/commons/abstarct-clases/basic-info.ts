import {FormGroup} from "@angular/forms";
import {EventEmitter, Input, Output} from "@angular/core";
import {AuthService} from "../../../core/providers/services/auth.service";

export type FormType = "create" | "update";

export abstract class BasicInfo<T> {

  @Output('update')
  protected updateEvent: EventEmitter<T> = new EventEmitter<T>();

  @Output('create')
  protected createEvent: EventEmitter<T> = new EventEmitter<T>();

  @Input()
  protected set info(data: T) {
    this._info = data;
  }

  @Input()
  set isReadOnly(value: boolean) {
    this._isReadOnly = value;
  }

  protected _isReadOnly: boolean;
  protected type: FormType;
  protected isAdministrator: boolean;

  _info: T;
  form: FormGroup;

  constructor(protected authService: AuthService) {}

  ngOnInit() {
    this.isAdministrator = this.authService.isAdministrator();
    this.type = this._info ? "update" : "create";
  }

  protected update() {
    this.updateEvent.emit(this.getData());
  }

  protected create() {
    this.createEvent.emit(this.getData());
  }

  protected getData(): T {
    return this.form.value;
  }
}
