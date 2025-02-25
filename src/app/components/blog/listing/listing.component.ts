import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Blog, IBlog } from '../../../models/blog.model';
import { ITheme } from '../../../models/theme.model';
import { BlogService } from '../../../services/blog/blog.service';
import { LoaderService } from '../../../services/loader/loader.service';
import { ThemeService } from '../../../services/themes/theme.service';
import { IPaginator } from '../../../models/generic/paginator';

@Component({
  selector: 'app-listing',
  imports: [
    DatePipe
  ],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css'
})
export class ListingComponent implements OnInit {
  protected themeService=inject(ThemeService);
  protected blogService=inject(BlogService);
  protected loaderService=inject(LoaderService);
  protected router=inject(Router);
  protected themes:ITheme[]=[];
  protected blogs:Blog[]=[];
  protected paginator:IPaginator<Blog>={
    data:[], 
    meta:{current_page:0, last_page:0, per_page:0, total:0}
  };
  selectedThemes:string[]=[];
  constructor() { }

  ngOnInit(): void {
    this.loaderService.show();
    this.themeService.getThemes().subscribe((themes) => {
      this.themes=themes;
    });
    this.loadBlogs();

  }

  loadBlogs(){
    this.blogService.getBlogs(this.paginator.meta.current_page,this.selectedThemes.join(',')).subscribe((paginator) => {
      this.paginator=paginator;
      this.blogs=paginator.data;
      this.loaderService.hide();
    });
  }


  voirPlus(blog:Blog){
    this.router.navigate(['/article',blog.slug+"-"+blog.id]);
  }
  
  nextPage(){
    if(this.paginator.meta.current_page < this.paginator.meta.last_page){
      this.loaderService.show();
      this.paginator.meta.current_page++;
      this.loadBlogs();
    }
  }

  previousPage(){
    if(this.paginator.meta.current_page>1){
      this.loaderService.show();
      this.paginator.meta.current_page--;
      this.loadBlogs();
    }
  }

  addFilter(theme:string){
    if(!this.selectedThemes.find(elt=>elt==theme)){
      this.selectedThemes.push(theme);
      this.loadBlogs();
    }
  }

  removeFilter(theme:string){
    this.selectedThemes=this.selectedThemes.filter(elt=>elt!=theme);
    this.loadBlogs();
  }
}
