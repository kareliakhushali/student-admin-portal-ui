import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/api-models/student.model';
import { GenderService } from '../../services/gender.service';
import { Gender } from 'src/app/models/api-models/gender.model';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId:string | null | undefined;
  //variable student of type student for storing the data
  student:Student ={
    id:'',
    firstName:'',
    lastName:'',
    dateOfBirth:'',
    email:'',
  mobile:0,
    genderId:'',
    profileImageUrl:'',
    gender:{
      id:'',
      description:''
    },
    address:{
      id:'',
      physicalAddress:'',
      postalAddress:''
    }
  }
  //for storing new student details

  isNewStudent=false;
  //header for add student
  header = '';
  displayProfileImageUrl='';
  // imageUpload = '';
  genderList:Gender[]=[];
  @ViewChild('studentDetailsForm') studentDetailsForm?:NgForm;
constructor(private readonly studentService:StudentService ,
  private readonly route:ActivatedRoute,
  private readonly genderService:GenderService,
  private snackbar:MatSnackBar,private router:Router)
{

}
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) =>{
        this.studentId=params.get('id');
if(this.studentId)
{
  if(this.studentId.toLowerCase()==='Add'.toLowerCase()){
//If the route contains the 'add'
  //new student functionality
  this.isNewStudent=true;
  this.header = 'Add New Student';
  this.setImage();
  }
  else{
   //otherwise
  //existing student functionality
    this.isNewStudent = false;
    this.header = 'Edit Student';
    this.studentService.getStudent(this.studentId)
  .subscribe(
    (successResponse)=>{
//store the response in the student
      this.student = successResponse;
     //  console.log(successResponse);

     this.setImage();

    },
  (errorResponse)=>{
    this.setImage();
  }
  );
  }

this.genderService.getGenderList()
.subscribe(
  (sucessResponse)=>{
    this.genderList = sucessResponse;

    //console.log(sucessResponse);
  }
)
}

      }
    );

  }
  onUpdate():void{
    if(this.studentDetailsForm?.form.valid){
//call student service to update
    //console.log(this.student);
    this.studentService.updateStudent(this.student.id,this.student)
    .subscribe(
      (successResponse)=>{
        console.log(successResponse);
        //show notification
this.snackbar.open('Student updated successfully',undefined,{
  duration:2000
});
      },
      (errorResponse)=>{

        //log it
        console.log(errorResponse);
      }

    )
  }
    }


  onDelete():void{
    this.studentService.deleteStudent(this.student.id)
.subscribe(
  (successResponse)=>{

    console.log(successResponse);
    this.snackbar.open('Student deleted successfully',undefined,{
      duration:2000
    });
    setTimeout(()=>{
      this.router.navigateByUrl('students');
    },2000);
  },
  (errorResponse)=>{
    //console
  }

)
  }
  onAdd():void{
    //adding validations while adding the data
    if(this.studentDetailsForm?.form.valid){
//submit formdata to api
this.studentService.addStudent(this.student)
    .subscribe(
      (successResponse)=>{
console.log(successResponse);
this.snackbar.open('Student added successfully',undefined,{
  duration:2000
});
setTimeout(()=>{
  this.router.navigateByUrl(`students/${successResponse.id}`);
},2000);
      },
      (errorResponse)=>{
//log
console.log(errorResponse);
      }
    );

  }

    }

  private setImage():void
  {
if(this.student.profileImageUrl)
{
  //fetch the image by url
  this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
}
else{
  //display a default
  this.displayProfileImageUrl = '/assets/default.png';
}
  }
  uploadImage(event:any):void{
if(this.studentId){
  const file:File = event.target.files[0];
  this.studentService.uploadImage(this.student.id,file)
  .subscribe(
    (successResponse)=>{
this.student.profileImageUrl = successResponse;
this.setImage();
this.snackbar.open('Profile Image updated ',undefined,{
  duration:2000
});

    },
    (errorResponse)=>{

    }

  );
}
  }


}
