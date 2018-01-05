import {Injectable} from "@angular/core";

@Injectable()
export class LocalStorageService {

  getItem(itemKey: string): string {
    const item: string = localStorage.getItem(itemKey);
    return item ? atob(item) : null;
  }

  setItem(itemKey: string, itemValue: string) {
    localStorage.setItem(itemKey, btoa(itemValue));
  }

  removeItem(data: string) {
    localStorage.removeItem(data);
  }

}
