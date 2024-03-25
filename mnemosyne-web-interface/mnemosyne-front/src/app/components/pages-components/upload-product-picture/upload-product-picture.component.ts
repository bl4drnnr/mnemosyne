import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'page-upload-product-picture',
  templateUrl: './upload-product-picture.component.html',
  styleUrls: ['./upload-product-picture.component.scss']
})
export class UploadProductPictureComponent {
  @Input() pictureName: string | ArrayBuffer | null;
  @Input() disabled: boolean = false;
  @Output() uploadedPicture = new EventEmitter<string | ArrayBuffer | null>();
  @Output() deletePicture = new EventEmitter<void>();

  selectedPicture?: FileList;
  preview: string | ArrayBuffer | null = '';
  uploadPictureIcon = `${this.envService.getStaticStorageLink}/icons/add-photo.svg`;
  productPicturesBucket = `${this.envService.getStaticStorageLink}/products/`;

  constructor(
    private readonly envService: EnvService,
    private elementRef: ElementRef
  ) {}

  clearFileInput() {
    const fileInput = this.elementRef.nativeElement.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onDeletePicture() {
    this.preview = null;
    this.pictureName = null;
    this.uploadedPicture.emit(null);
    this.selectedPicture = undefined;
    this.deletePicture.emit();
  }

  selectFile(event: any) {
    this.selectedPicture = event.target.files;

    if (!this.selectedPicture) return;

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.preview = reader.result;
      this.uploadedPicture.emit(this.preview);
    };
  }
}
