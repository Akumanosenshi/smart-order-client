import {Component} from '@angular/core';
import {StorageService} from "./services/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private storageService: StorageService) {
    // this.init();
  }

  async init() {
    await this.storageService.setToken("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkByb290LmZyIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzQ0MjE4OTY2fQ.HwbZOhmEYwNok436Tqf5iWQI_yXm1fmtqs02wQJJxKo");
    await this.storageService.setRole("RESTAURANT");
  }
}
