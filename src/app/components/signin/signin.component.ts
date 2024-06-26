import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { WorkOrderService } from 'src/app/services/work-order.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm!: FormGroup;
  data!:any;
  isLoading = false;


  

  constructor(
    private authService:AuthService,
    private generalService:GeneralService,
    private toastr:ToastrService,
    private router:Router,
    private workService:WorkOrderService
  ){}



  ngOnInit(){
    this.generalService.generateSystemsAndSubSystems();
    this.generalService.generateWorkers();
    this.signinForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
    })
    this.authService.me().subscribe(
      (response)=>{console.log(response)}
    )
  }


  onSignIn(){
    this.generalService.generateSystemsAndSubSystems();
    this.generalService.generateWorkers();
    this.isLoading = true;
    this.authService.signIn(this.signinForm.value).subscribe(
      (response)=>{
        this.data = response

        //Usuario o Contraseña incorrecta
        if(this.data.status == 0){
          
          this.toastr.error(
            this.data.message,
            'Error',
            { timeOut: 1500, progressBar: true }
          );
        }

        if(this.data.status == 1){

          this.authService.saveToken(this.data.token),
          this.authService.saveUser(this.data.user),
          this.router.navigate(['/home/work-order-list']);

          console.log("respuesta"+this.data.user.name)
        
          this.toastr.success(
            this.data.message,
            'Éxito',
            { timeOut: 1500, progressBar: true }
          );
        }

        if(this.data.code == 500){
          this.toastr.error(
            this.data.message,
            'Success',
            { timeOut: 1500, progressBar: true }
          );
        }

        this.isLoading = false;

      },
      (error)=>{
        console.log(error);
        this.isLoading = false;
      }
    )
  }

}
