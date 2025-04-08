import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, IonModal} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {User} from "../../../models/user";
import {UserService} from "../../../services/student.service";

;

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    NgIf,
    NgForOf
  ]
})
export class RegisterModalComponent implements OnInit {

  @Input() registerModal: IonModal | undefined;
  @Input() registerFunction: Function | undefined;

  registerUser: Partial<User> = {};
  confirmPassword: string = '';

  errorMessage: string = '';

  constructor(protected UserService: UserService) {
  }

  register() {
    if (!this.validateInputs()) {
      return;
    }
    if (this.registerFunction) {
      this.registerFunction(this.registerUser);
    }
  }

  cancel() {
    this.registerModal?.dismiss(null, 'cancel').then();
  }

  validateInputs(): boolean {
    if (!this.registerUser.firstname || !this.registerUser.lastname || !this.registerUser.email ||
      !this.registerUser.mdp || !this.confirmPassword || !this.registerUser.birthdate) {
      this.errorMessage = "Tous les champs doivent être remplis.";
      return false;
    }

    if (this.registerUser.mdp !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return false;
    }

    return true;
  }

  doneCalendar() {
    if (this.registerUser)
      this.registerUser.birthdate = this.studentService.formatISODate(new Date(this.calendar));
  }

  ngOnInit(): void {
    this.registerUser.birthdate = this.studentService.formatISODate(new Date(Date.now()));
  }

  protected readonly Formation = Formation;
  protected readonly Graduation = Graduation;
}
