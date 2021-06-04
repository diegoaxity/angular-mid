import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/login.model';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin?: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private loginSvc: LoginService, private dataSvc: DataService, private router: Router) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.dataSvc.isLoading.asObservable().subscribe(loading => {
      this.loading = loading;
    });
  }

  ngOnInit(): void {
  }

  loginClick() {
    const data = this.formLogin?.value as LoginRequest;
    /*
    {
      email: "eve.holt@reqres.in"
      password: "12345"
    }
    */
   this.dataSvc.isLoading.next(true);
   this.loginSvc.login(data).subscribe(res => {
     // res.token
     console.log(res);
     this.dataSvc.setToken(res.token);
     this.dataSvc.isLoading.next(false);
     this.router.navigate(['users']);
   }, err => {
     this.dataSvc.message.next(err.error.error);
     this.dataSvc.isLoading.next(false);
   });
  }
}
