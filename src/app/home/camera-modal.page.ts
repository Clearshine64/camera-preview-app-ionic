import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';

@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.page.html',
  styleUrls: ['./camera-modal.page.scss'],
})

export class CameraModalPage implements OnInit {

  @Input() name: string;

  smallPreview: boolean;
  lastImage: any = null;
  colorEffect = 'none';
  setZoom = 1;
  flashMode = 'off';
  isToBack = false;
  imageList = [];
  isiPadTablet = false;

  @ViewChild('content') private content: any;

  constructor(
    private modalCtr: ModalController,
    private alertController: AlertController,
    public platform: Platform,
    private cameraPreview: CameraPreview
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.isiPadTablet = this.platform.is('ipad') || this.platform.is('tablet') || this.platform.is('desktop');
    console.log(this.isiPadTablet);
    //this.isiPadTablet = false;
    
    /*this.imageList = ['https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x1920/681e2ff55f97d7cc1b7a4ef30b57dde8/photo-1623665038131-5c5d434b8bcf.jpg',
    'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x1920/681e2ff55f97d7cc1b7a4ef30b57dde8/photo-1623665038131-5c5d434b8bcf.jpg',
    'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x1920/681e2ff55f97d7cc1b7a4ef30b57dde8/photo-1623665038131-5c5d434b8bcf.jpg',
    'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x1920/681e2ff55f97d7cc1b7a4ef30b57dde8/photo-1623665038131-5c5d434b8bcf.jpg',
    'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x1920/681e2ff55f97d7cc1b7a4ef30b57dde8/photo-1623665038131-5c5d434b8bcf.jpg'];*/
    this.imageList = [];

    let winWidth = window.screen.width;
    let winHeight = window.screen.height;
    console.log("width = " + winWidth);
    console.log("height = " + winHeight);

    if(this.platform.isLandscape()) {
      console.log("=========landscape==========");
      if(winWidth < winHeight) {
        winWidth = winHeight;
      }
    }

    setTimeout(() => {
      if(this.isiPadTablet) {
        if(this.platform.is('android')) {
          this.cameraPreview.startCamera({ x: winWidth / 2, y: 57, width: winWidth / 2, height: 320, camera: "rear", tapPhoto: true, previewDrag: false, toBack: false });
        } else if(this.platform.is('ios')) {
          this.cameraPreview.startCamera({ x: winWidth / 2, y: 57, width: winWidth / 2, height: 320, camera: "rear", tapPhoto: true, previewDrag: false, toBack: false });
        }
      } else {
        if(this.platform.is('android')) {
          this.cameraPreview.startCamera({ x: 0, y: 57, width: winWidth, height: 320, camera: "rear", tapPhoto: true, previewDrag: false, toBack: false });
        } else if(this.platform.is('ios')) {
          this.cameraPreview.startCamera({ x: 0, y: 96, width: winWidth, height: 320, camera: "rear", tapPhoto: true, previewDrag: false, toBack: false });
        }
      }
    }, 1000);    
  }

  async close() {
    this.cameraPreview.stopCamera();
    const closeModal: string = "Modal Closed";
    await this.modalCtr.dismiss({
      imageList: this.imageList
    });
  }

  async cancelModal() {
    const alert = await this.alertController.create({
      header: 'Alert',
      cssClass: 'cancel-modal',
      message: 'Photos will be discarded , do you wish to continue?',
      buttons: [
        {
          text: 'Return and edit',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {            
          }
        }, {
          text: 'Continue and discard',
          handler: async () => {
            this.cameraPreview.stopCamera();
            await this.modalCtr.dismiss({
              imageList: []
            });
          }
        }
      ]
    });

    await alert.present();
  }

  startCameraAbove() {
    this.cameraPreview.stopCamera().then(() => {
      this.isToBack = false;
      this.cameraPreview.startCamera({ x: 80, y: 450, width: 250, height: 300, toBack: false, previewDrag: true, tapPhoto: true });
    }, err => {
      this.isToBack = false;
      this.cameraPreview.startCamera({ x: 80, y: 450, width: 250, height: 300, toBack: false, previewDrag: true, tapPhoto: true });
    })
  }

  startCameraBelow() {
    this.cameraPreview.stopCamera().then(() => {
      this.isToBack = true;
      this.cameraPreview.startCamera({ x: 40, y: 100, width: 250, height: 300, camera: "front", tapPhoto: true, previewDrag: true, toBack: false });
    }, err => {
      this.isToBack = true;
      this.cameraPreview.startCamera({ x: 40, y: 100, width: 250, height: 300, camera: "front", tapPhoto: true, previewDrag: true, toBack: false });
    })
  }

  stopCamera() {
    this.cameraPreview.stopCamera();
  }

  takePicture() {
    console.log("==new photo point preview take picture==")
    this.cameraPreview.takePicture({
      width: 640,
      height: 640,
      quality: 85
    }).then((imageData) => {
      this.lastImage = 'data:image/jpeg;base64,' + imageData;
      this.imageList.push(this.lastImage);
      this.content.scrollToBottom(500);
      //console.log(imageData);
    }, (err) => {
      console.log(err);
      this.lastImage = 'assets/img/test.jpg';
    });
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  show() {
    this.cameraPreview.show();
  }

  hide() {
    this.cameraPreview.hide();
  }

  changeColorEffect() {
    this.cameraPreview.setColorEffect(this.colorEffect);
  }

  changeFlashMode() {
    this.cameraPreview.setFlashMode(this.flashMode);
  }

  changeZoom() {
    this.cameraPreview.setZoom(this.setZoom);
  }

  showSupportedPictureSizes() {
    this.cameraPreview.getSupportedPictureSizes().then((sizes) => {
      console.log(sizes);
    }, (err) => {
      console.log(err);
    });
  }

  removeImage(idx) {
    this.imageList.splice(idx, 1);
  }

}