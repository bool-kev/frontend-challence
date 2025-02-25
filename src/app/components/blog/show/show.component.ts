import { DatePipe, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extractSlugParams } from '../../../functions/helper';
import { Blog } from '../../../models/blog.model';
import { AuthService } from '../../../services/auth/auth.service';
import { BlogService } from '../../../services/blog/blog.service';
import { LoaderService } from '../../../services/loader/loader.service';

@Component({
  selector: 'app-show',
  imports: [
    DatePipe,
  ],
  templateUrl: './show.component.html',
  styleUrl: './show.component.css'
})
export class ShowComponent implements OnInit {

  protected blogService = inject(BlogService);
  protected blog: Blog | null = null;
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected authService = inject(AuthService);
  protected location = inject(Location);
  protected loaderService = inject(LoaderService);
  protected routeParams: { id: number, slug: string } = { id: 0, slug: '' };
  protected errorMessage: string | null = null;
  ngOnInit(): void {
    this.loaderService.show();
    this.route.params.subscribe(params => {
      try {
        this.routeParams = extractSlugParams(params['slug']);
      } catch (error) {
        this.loaderService.hide();
        this.router.navigate(['/not-found']);
        return;
      }
      this.blogService.getBlog(this.routeParams.id).subscribe(data => {
        this.loaderService.hide();
        if (!data || data.slug != this.routeParams.slug) {
          this.router.navigate(['/not-found']);
          return;
        }
        this.blog = data;
      });
    }
    );
  }

  toggleLike() {
    if (!this.authService.user()) {
      if (confirm("Vous devez vous connecter pour aimer cet article. Voulez-vous vous connecter?")) {
        this.router.navigate(['/login']);
      }
      return;
    }
    this.blogService.toggleLike(this.blog?.id ?? 0).subscribe(data => {
      if (this.blog && data) {
        this.blog.like = data.like;
      }
    });
  }

  editBlog(){
    if(!this.authService.user()){
      if (confirm("Vous devez vous connecter pour modifier cet article. Voulez-vous vous connecter?")) {
        this.router.navigate(['/article', this.blog?.slug+"-"+this.blog?.id, 'edit']);
      }
      return;
    }else if (this.authService.user()?.id!=this.blog?.author.id) {
      alert("Vous n'êtes pas autorisé à modifier cet article.");
      return;
    }
    this.router.navigate(['/article', this.blog?.slug+"-"+this.blog?.id, 'edit']);
  }

  deleteBlog() {
    if(!this.authService.user() && !localStorage.getItem('token')){
      if (confirm("Vous devez vous connecter pour supprimer cet article. Voulez-vous vous connecter?")) {
        this.router.navigate(['/login']);
      }
      return;
    }
    if (this.authService.user()?.id!=this.blog?.author.id) {
      this.errorMessage = "Vous n'êtes pas autorisé à supprimer cet article.";
      return;
    }
    if (confirm("Voulez-vous vraiment supprimer cet article?")) {
      this.blogService.deleteBlog(this.blog?.id ?? 0).subscribe(_ => {
          this.router.navigate(['/acceuil']);
      });
    }
  }
}
