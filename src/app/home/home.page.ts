import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CameraModalPage } from './camera-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public modalController: ModalController,
              public platform: Platform,) {}

  async openCameraModal() {
    const isiPadTablet = this.platform.is('ipad') || this.platform.is('tablet') || this.platform.is('desktop');
    const modal = await this.modalController.create({
      component: CameraModalPage,
      cssClass: isiPadTablet ? 'modal-fullscreen' : '',
      backdropDismiss: false
    });
    modal.onDidDismiss().then(data => {
        //console.log(data.data.imageList);
        const imageList = data.data.imageList;        
    });
    return await modal.present();
  }
}
