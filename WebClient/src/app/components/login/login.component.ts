import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUserModel } from 'src/app/models/login-user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginModel: LoginUserModel = new LoginUserModel();

  constructor(
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService
    ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.router.navigateByUrl('/chat');
    }
  }

  public onSubmit(form: NgForm): void {
    const loginData: LoginUserModel = new LoginUserModel();
    loginData.UserName = form.value.UserName;
    loginData.Password = form.value.Password;

    this.userService.login(loginData).subscribe(
      (response: any) => {
        localStorage.setItem('userName', this.loginModel.UserName);
        localStorage.setItem('token', response.token);
        this.router.navigateByUrl('/chat');
        this.toastrService.success(this.loginModel.UserName, 'Welcome');
      },
      error => {
        if (error.status == 400) {
          this.toastrService.error('Incorrect username or password.', 'Authentication failed.');
        }
        else {
          console.log(error);
        }
      }
    );
  }

}
