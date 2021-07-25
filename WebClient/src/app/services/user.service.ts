import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { RegisterUserModel } from "../models/register-user.model";
import { Observable } from "rxjs";
import { LoginUserModel } from "../models/login-user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    readonly BaseURI = 'http://localhost:5000/api';
    constructor(
        private fb: FormBuilder, 
        private http: HttpClient, 
        private router: Router
        ) { }

    public formModel: FormGroup = this.fb.group({
        UserName: ['', Validators.required],
        Passwords: this.fb.group({
            Password: ['', [Validators.required, Validators.pattern('^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$')]],
            ConfirmPassword: ['', Validators.required]
        }, { validator: this.comparePasswords })
    });

    private comparePasswords(fb: FormGroup): void {
        let confirmPswrdControl = fb.get('ConfirmPassword');
        if (confirmPswrdControl.errors == null || 'passwordMismatch' in confirmPswrdControl.errors) {
          if (fb.get('Password').value != confirmPswrdControl.value) {
            confirmPswrdControl.setErrors({ passwordMismatch: true });
          }
          else {
            confirmPswrdControl.setErrors(null);
          }
        }
    }

    public register(): Observable<RegisterUserModel> {
        const registerData: RegisterUserModel = {
          UserName: this.formModel.value.UserName,
          Password: this.formModel.value.Passwords.Password
        };
        return this.http.post<RegisterUserModel>(this.BaseURI + '/users/register', registerData);
    }

    public login(data: LoginUserModel): Observable<any> {
        return this.http.post<any>(this.BaseURI + '/users/login', data);
    }

    public logout(): void {
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
