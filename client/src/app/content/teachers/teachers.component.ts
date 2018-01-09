import {Component, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../core/providers/services/auth.service";
import {Teacher} from "../../models/teacher";
import {globalProperties} from "../../../environments/properties";
import {Observable} from "rxjs/Observable";
import {ContentService} from "../../core/providers/services/content.service";
import {
  ConfirmationData,
  ConfirmationModalComponent
} from "../commons/confirmation-modal/confirmation-modal.component";
import {Student} from "../../models/student";

@Component({
  selector: "gl-profesores",
  templateUrl: "./teachers.component.html"
})
export class TeachersComponent implements OnInit  {

  @ViewChild("confirmModal") confirmModal: ConfirmationModalComponent;

  title: string = "All Teachers";
  teachers: Observable<Teacher[]>;
  isAdministrator: boolean;
  deleteModalData: ConfirmationData = {
    type: "delete",
    title: "Delete",
    text: "Are you sure you want to delete the element ?",
    action: null
  };

  constructor(private authService: AuthService,
              private contentService: ContentService) {}

  ngOnInit() {
    this.teachers = this.contentService
      .getContent<Teacher[]>(globalProperties.teachersPath)
      .catch(error => Observable.throw(error));

    this.isAdministrator = this.authService.isAdministrator();
  }

  onDetails(entity: Teacher) {
    console.log("view details of: ", entity);
  }

  onEdit(entity: Teacher) {
    console.log("edit details of: ", entity);
  }

  onDelete(teacher: Teacher) {
    this.deleteModalData.action = this.delete(teacher);
    this.confirmModal.open();
  }

  private delete(teacher: Teacher) {
    return () => {
      console.log("delete: ", teacher);
    }
  }
}
