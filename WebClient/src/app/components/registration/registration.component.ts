import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(
    public userService: UserService,
    private router: Router,
    private toastrService: ToastrService) { }

  public onSubmit(): void {
    this.userService.register().subscribe(
      (response: any) => {
        if (response.succeeded) {
          this.userService.formModel.reset();
          this.router.navigateByUrl('/login');
          this.toastrService.success('New user created!', 'Registration successful.');
        } else {
          response.errors.forEach((element: any) => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastrService.error('Username is already taken','Registration failed.');
                break;
              default:
              this.toastrService.error(element.description,'Registration failed.');
                break;
            }
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
