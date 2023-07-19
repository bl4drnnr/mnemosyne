import { Component } from '@angular/core';
import { UserPhotoService } from '@components/user-photo/user-photo.service';

@Component({
  selector: 'basic-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.scss']
})
export class UserPhotoComponent {
  selectedFiles?: FileList;
  currentFile?: File;
  preview = '';

  constructor(private readonly userPhotoService: UserPhotoService) {}

  selectFile(event: any): void {
    this.preview = '';
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        const accessToken = localStorage.getItem('_at')!;

        this.userPhotoService
          .upload({
            file: this.currentFile,
            accessToken
          })
          .subscribe({
            next: () => {
              //
            },
            error: () => {
              //
            }
          });
      }

      this.selectedFiles = undefined;
    }
  }
}
