export interface IUser{
    id: number;
    nom: string;
    bio: string;
    avatar: string|null;
    prenom: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}


export interface ICredentials{
    email: string;
    password: string;
}

export interface IAuthResponse{
    user: IUser;
    token: string;
}


export class User{
    id: number;
    nom: string;
    bio: string;
    avatar: string|null;
    prenom: string;
    email: string;
    createdAt: string;
    updatedAt: string;

    constructor(user: IUser){
        this.id = user.id;
        this.nom = user.nom;
        this.bio = user.bio;
        this.avatar = user.avatar;
        this.prenom = user.prenom;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    get fullName(){
        return this.prenom + ' ' + this.nom;
    }

    getAvatar(){
        return this.avatar ?? '/avatar.webp';
    }
}
