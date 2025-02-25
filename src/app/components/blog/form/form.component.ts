import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { BlogService } from '../../../services/blog/blog.service';
import { Blog, IBlogRequest } from '../../../models/blog.model';
import { extractSlugParams } from '../../../functions/helper';
import { LoaderService } from '../../../services/loader/loader.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-form',
  imports:[
    ReactiveFormsModule,
    QuillEditorComponent,
    CommonModule 
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  protected router=inject(Router);
  protected route=inject(ActivatedRoute);
  protected blogService=inject(BlogService);
  private loaderService=inject(LoaderService);
  private authService=inject(AuthService);
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  blog:Blog|null=null;
  editMode:boolean=false;
  routeParams:{id:number,slug:string}={id:0,slug:''};
  constructor() {
    
    this.form = new FormGroup({
      titre: new FormControl('',[Validators.required]),
      themes: new FormControl('',[Validators.required]),
      content: new FormControl('',[Validators.required]),
      image: new FormControl(null),
    });

    this.preventDefaultDragAndDrop();
    this.handleFileDrop();
    this.route.paramMap.subscribe((params) => {
      if(params.get('slug')){
        this.loaderService.show();
        this.routeParams=extractSlugParams(params.get('slug')??'');
        console.log(this.routeParams);
        this.blogService.getBlog(this.routeParams.id).subscribe((blog) => {
          if(blog && blog.slug==this.routeParams.slug && blog.author.id==this.authService.user()?.id){
            this.editMode = true;
            this.blog = blog;
            this.form.patchValue({
              titre: blog.titre,
              content: blog.content,
              themes: blog.getThemes()
            });
            this.imagePreview = blog.image;
          }else{
            this.router.navigate(['/not-found']);
            this.loaderService.hide();
            return ;
          }
          this.loaderService.hide();
        });
      }
    });
  }

  preventDefaultDragAndDrop() {
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => e.preventDefault());
  }

  handleFileDrop() {
    window.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        this.onFileChange({ target: { files: event.dataTransfer.files } });
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.form.patchValue({ image: file });
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.form.patchValue({ image: null });
  }

  onSubmit() {
    console.log("form",this.form.value);
    if (this.form.invalid) {
      return;
    }
    if (this.editMode) {
      // Update existing blog
      this.blogService.updateBlog(this.routeParams.id, this.form.value).subscribe((res) => {
        console.log("res",res);
        
        if(res){
          this.router.navigate(['/article', res.slug+"-"+res.id]);
        }
      });
    } else {
      // Create new blog
      this.blogService.createBlog(this.form.value as IBlogRequest).subscribe((res) => {
        if(res){
          this.router.navigate(['/article', res.slug+"-"+res.id]);
        }
      });
    }
  }
}
