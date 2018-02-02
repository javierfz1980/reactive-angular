import {Injectable} from "@angular/core";

/**
 * Mock Service that simulates fetching data from the API.
 */
@Injectable()
export class MockAuthService {

  isAdmin: boolean = true;

  isAdministrator(fake?: boolean): boolean {
    return fake ? fake : this.isAdmin;
  }

}
