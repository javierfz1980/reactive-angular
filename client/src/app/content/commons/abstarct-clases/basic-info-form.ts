import {FormGroup} from "@angular/forms";
import {EventEmitter, Input, Output} from "@angular/core";

export type FormType = "create" | "update";

export abstract class BasicInfoForm<T> {

  @Output('update')
  protected updateEvent: EventEmitter<T> = new EventEmitter<T>();

  @Output('create')
  protected createEvent: EventEmitter<T> = new EventEmitter<T>();

  @Input()
  protected isReadOnly: boolean;

  protected data: T;
  protected form: FormGroup;
  protected type: FormType;

  ngOnInit() {
    this.type = this.data ? "update" : "create";
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