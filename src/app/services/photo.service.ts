import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, WriteFileResult } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Photo } from '../models/photo.interface';
import { Storage } from '@capacitor/storage';

export interface IUserPhoto {
  filepath: string;
  webviewPath: string;
}


@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: IUserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  getPhotos(): Photo[] {
    throw new Error('Method not implemented.');
  }
  deletePicture(photo: PhotoService, position: number) {
    throw new Error('Method not implemented.');
  }

  constructor() { }

  public async addNewToGallery():Promise<void> {
    // Take a photo
    const capturedPhoto:Promise<Photo> = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
    .catch(Error => Error) //<= Avoids display errors on browser console

    console.log('Foto ==>', capturedPhoto);

   const saveImageFile: IUserPhoto = await this.savePicture(capturedPhoto);
   this.photos.unshift(saveImageFile);

   console.log('Array of fotos', this.photos);

   Storage.set({
    key: this.PHOTO_STORAGE,
    value: JSON.stringify(this.photos),
   });

  }

  public async savePicture(photo: Promise<Photo>): Promise<any>{
    const base64Data = await this.readAsBase64((await photo));
    console.log('SavePicture photo recive =>', photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile: Promise<WriteFileResult> = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })
    .catch(Error => Error);


  console.log('savePicture return =>', savedFile);

  return {
    filepath: fileName,
    webviewPath: (await photo).webPath
  };
}

public async loadSaved(): Promise<void> {
  // Retrieve cached photo array data
  const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
  console.log('PhotoList =>',photoList)
  this.photos = JSON.parse('photoList.value') || [];
  console.log('loadSaved photos =>', this.photos)

  // Display the photo by reading into base64 format
  for (let photo of this.photos) {
    // Read each saved photo's data from the Filesystem
    const readFile = await Filesystem.readFile({
      path: photo.webviewPath,
      directory: Directory.Data,
    })
    .catch(Error => Error);

    // Web platform only: Load the photo as base64 data
    photo.webviewPath = (await photo).webviewPath;
  }
}

private async readAsBase64(photo: Photo): Promise<string> {
  // Fetch the photo, read as a blob, then convert to base64 format
  const response = await fetch(photo.webPath!);
  const blob = await response.blob();

  return await this.convertBlobToBase64(blob) as string;
}

private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

}
