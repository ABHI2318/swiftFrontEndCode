

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanOfficerService } from 'src/app/services/loan-officer/loan-officer.service';
import { LoginService } from 'src/app/services/login/login.service';


@Component({
  selector: 'app-updateprofile',
   templateUrl: './updateprofile.component.html',
   styleUrls: ['./updateprofile.component.css']
})
export class UpdateprofileComponent {
 
  userForm: FormGroup;
  dissable: boolean = true;
  value: string="";
   constructor(private fb: FormBuilder, 
     private  loanOfficerService: LoanOfficerService, private router: Router) {
 
 
       this.loanOfficerService.fetchUser().subscribe(data=>{
         this.userForm.patchValue(data);
         this.value = data.email;
         
       })
     this.userForm = this.fb.group({
       // {
       email: new FormControl({value:this.value,disabled:true}),
       // ('', [
       //   Validators.required,
       //   Validators.email
       // ]),
 
       password: new FormControl(),
       // ('', [
       //   Validators.required,
       //   Validators.pattern(
       //     '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
       //   )
       // ]),
       firstName: new FormControl(),
       // ('', [
       //   Validators.required,
       //   Validators.pattern("^[A-Za-z]+(?:[ -'][A-Za-z]+)*$")
       // ]),
       lastName: new FormControl(),
       // ('', [
       //   Validators.required,
       //   Validators.pattern("^[A-Za-z]+(?:[ -'][A-Za-z]+)*$")
       // ]),
       contactNumber: new FormControl(),
       // ('', [
       //   Validators.required,
       //   Validators.pattern("^[7-9]{1}[0-9]{9}$")
       // ]),
       pancardNumber: new FormControl(),
       dob: new FormControl(),
       // ('', [Validators.required]),
       // pancardNumber: new FormControl('', [
       //   Validators.required,
       //   Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
       // ]),
       gender: new FormControl()
     //   ('', [Validators.required])
     // });
   });
 }
 
 onSubmit() {
   if (this.userForm.valid) {
     console.log(this.userForm.value);
     
     this.loanOfficerService.updateUser(this.userForm.value).subscribe
    ({
                  next: (data) =>{ 
                   alert(" Update successfully");
                   this.router.navigateByUrl('/login');
                },  error: (error: HttpErrorResponse) => {
                  if (error.status === 400 && error.error && error.error.message) {
                    alert(error.error.message); // Show the custom error message from the response
                  } else {
                    alert("An unexpected error occurred!"); // Fallback for other errors
                  }
                },
              });
   } else {
     alert("Please fill out the form correctly.");
   }
 }
 }
   // onSubmit() {
   //   // if (this.userForm.valid) {
   //     this.loginService.register(this.userForm.value).subscribe(
   //       data => {
   //         alert("User added successfully");
   //         this.router.navigateByUrl('/');
   //       },
   //       error => {
   //         alert("An error occurred during registration");
   //       }
   //     );
   //   // } else {
   //   //   alert("Please fill out the form correctly.");
   //   // }
   // }
 
   // get username() { return this.userForm.get('username'); }
   // get password() { return this.userForm.get('password'); }
   // get firstname() { return this.userForm.get('firstname'); }
   // get lastname() { return this.userForm.get('lastname'); }
   // get contactNo() { return this.userForm.get('contactNo'); }
   // get dob() { return this.userForm.get('dob'); }
   // get pancardNumber() { return this.userForm.get('pancardNumber'); }
   // get gender() { return this.userForm.get('gender'); }
 