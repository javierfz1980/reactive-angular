import {Component, OnInit} from "@angular/core";
import {AuthService} from "./common/services/auth.service";

@Component({
  selector: 'gl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string = 'gl';
  isLogedIn: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLogedIn = this.authService.isLogedIn();
  }
}
