import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Photo } from '../models/photo.interface';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  getPhotos(): Photo[] {
    throw new Error('Method not implemented.');
  }
  deletePicture(photo: PhotoService, position: number) {
    throw new Error('Method not implemented.');
  }
  loadSaved() {
    throw new Error('Method not implemented.');
  }

  constructor() { }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
  }
}
