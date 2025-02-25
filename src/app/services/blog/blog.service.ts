import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Blog, IBlog, IBlogRequest } from '../../models/blog.model';
import { IPaginator } from '../../models/generic/paginator';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private httpClient=inject(HttpClient);
  private apiURL=environment.apiURL+"/blog";

  constructor() { }

  getBlogs(page:number=1,themes:string=""):Observable<IPaginator<Blog>>{
    console.log("themes",themes);
    
    return this.httpClient.get<IPaginator<Blog>>(`${this.apiURL}?page=${page}&themes=${themes}`)
    .pipe(
      catchError((error) => {
        return of({data:[], meta:{current_page:0, last_page:0, per_page:0, total:0}});
      })
    );
  }

  getBlog(id:number):Observable<Blog|null>{
    return this.httpClient.get<IBlog>(this.apiURL+"/"+id)
    .pipe(
      map((blog) => new Blog(blog)),
      catchError((error) => {
        return of(null);
      })
    );
  }

  createBlog(blog:IBlogRequest):Observable<Blog|null|any>{
    const formData = new FormData();
    formData.append('titre', blog.titre);
    formData.append('content', blog.content);
    formData.append('image', blog.image);
    formData.append('themes', blog.themes);
 
    return this.httpClient.post<Blog>(this.apiURL, formData)
    .pipe(
      catchError((error) => {
      return of(null);
      })
    );
  }

  updateBlog(id:number,blog:IBlogRequest):Observable<Blog|null>{
    const formData = new FormData();
    formData.append('titre', blog.titre);
    formData.append('content', blog.content);
    formData.append('themes', blog.themes);
    formData.append('_method', 'PUT');
    if(blog.image){
      formData.append('image', blog.image);
    }
    return this.httpClient.post<Blog>(this.apiURL+"/"+id, formData)
    .pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  deleteBlog(id:number):Observable<boolean>{
    return this.httpClient.delete<boolean>(this.apiURL+"/"+id)
    .pipe(
      catchError((error) => {
        return of(false);
      })
    );
  }

  toggleLike(id:number):Observable<Blog|null>{
    return this.httpClient.post<IBlog>(this.apiURL+"/"+id+"/like", {})
    .pipe(
      map((blog) => new Blog(blog)),
      catchError((error) => {
        return of(null);
      })
    );
  }
}
