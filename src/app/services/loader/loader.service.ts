import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public loading: boolean = false;
  constructor() { }

  public show(){
    this.loading=true;
  }

  public hide(){
    this.loading=false;
  }

}
