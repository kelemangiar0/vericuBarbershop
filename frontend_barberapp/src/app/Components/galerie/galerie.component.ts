import { Component } from '@angular/core';

@Component({
  selector: 'app-galerie',
  templateUrl: './galerie.component.html',
  styleUrls: ['./galerie.component.scss']
})
export class GalerieComponent {
  imagini: string[] = [
    'assets/1.png',
    'assets/2.png',
    'assets/3.png',
    'assets/4.png',
    'assets/5.png',
    'assets/6.png',
    'assets/7.png'
  ];

  // // Metoda pentru deschiderea File Explorer și preluarea imaginii selectate
  // openFileExplorer(): void {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = 'image/*';

  //   input.onchange = (event: any) => {
  //     const file: File = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     reader.onload = () => {
  //       const imageDataURL: string = reader.result as string;
  //       this.imagini.push(imageDataURL);
  //     };
  //   };

  //   input.click();
  // }
}
