import { environment } from "../../environments/environment.development";
import { ITheme } from "./theme.model";
import { IUser, User } from "./user.model";

export interface IBlog{
    id: number;
    titre: string;
    content: string;
    image: string|null;
    vues: number;
    like: number[];
    commentaires: any[];
    avatar: any;
    bio: string;
    slug: string;
    themes:ITheme[];
    author:IUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBlogRequest{
    titre: string;
    content: string;
    image: any;
    themes: string;
}


export class Blog{
    id: number;
    titre: string;
    content: string;
    image:string|null;
    vues: number;
    like: number[];
    slug: string;
    themes:ITheme[];
    author:User;
    commentaires: any[];
    createdAt: Date;
    updatedAt: Date;

    constructor(blog: IBlog){
        this.id = blog.id;
        this.titre = blog.titre;
        this.content = blog.content;
        this.vues = blog.vues;
        this.like = blog.like;
        this.image = blog.image;
        this.commentaires = blog.commentaires;
        this.author = new User(blog.author);
        this.slug = blog.slug;
        this.themes = blog.themes;
        this.createdAt = blog.createdAt;
        this.updatedAt = blog.updatedAt;
    }

    getThemes(){
        return this.themes.map(theme => theme.titre).join(', ');
    }

    isLikedBy(userId:number){
        return this.like.includes(userId);
    }

    get url(){
      return `${environment.appURL}/article/${this.slug}-${this.id}`;
    }

}

