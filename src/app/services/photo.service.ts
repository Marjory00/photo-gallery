import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@angular/core';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';


  constructor(
    private platform: Platform ) { }


public async loadSaved() {
  // Retrieve catched photo array data
  const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
  this.photos = JSON.parse(photoList.value) || [];


// If running on the web...
if (!this.platform.is('hybrid')) {
  // Display the photo by reading into base64 format
  for (let photo of this.photos) {
    // Read each saved photo's data from the FileSystem
    const readFile = await Filesystem.readFile({
      path: photo.filepath,
      directory: Directory.Data,
    });

    // Web platform only: Load the photo as base64 data
    photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
  }
}
}
/* Use the device camera to take a photo:
  // https://capacitor.ionicframework.com/docs/apis/camera
  // Store the photo data into permanent file storage:
  // https://capacitor.ionicframework.com/docs/apis/filesystem
  // Store a reference to all photo filepaths using Storage API:
  // https://capacitor.ionicframework.com/docs/apis/storage
  */

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100, // highest quality (0 to 100)
    });

    const savedImageFile = await this.savePicture(capturePhoto);

    // Add new photo to Photos array
this.photos.unshift(savedImageFile);

// Cache all photo data for future retrieval
Preferences.set({
  key: this.PHOTO_STORAGE,
  value: JSON.stringify(this.photos),
});
  }

  // Save picture to file on device
  private async savePicture(photo: Photo) {
// Convert photo to base64 format, required by FileSystem API to save
const base64Data = await this.readAsBase64(photo);


// Write the file to the data directory
const fileName = new Date().getTime() + '.jpeg';
const savedFile = await Filesystem.writeFile({
  path: fileName,
  data: base64Data,
  directory: Directory.Data,
});



  }


}
