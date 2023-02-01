import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
/* import { UserPhoto } from '../services/photo.service'; */
import { ActionSheetController } from '@ionic/angular';
import { Photo } from '../models/photo.interface';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public photos: Photo[] = [];
  PhotoService: any;


  constructor(public photoService: PhotoService,
    public actionSheetController: ActionSheetController) {}


    addPhotoToGallery() {
      this.photoService.addNewToGallery();
    }

   ngOnInit(){
    this.PhotoService.loadSaved().then(() => {
      this.photos = this.PhotoService.getPhotos();
    });
  }

  public newPhoto(): void{
    this.photoService.addNewToGallery();
  }
}


