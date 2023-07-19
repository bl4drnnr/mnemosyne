import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { EnvService } from '@shared/env.service';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'basic-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.scss']
})
export class UserPhotoComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @Input() isProfilePicPresent: boolean;
  @Input() userId: string;

  selectedFiles?: FileList;
  preview: string | ArrayBuffer | null = '';
  userProfilePictureLink: string;

  staticStorageLink = this.envService.getStaticStorageLink;

  constructor(
    private readonly envService: EnvService,
    private readonly usersService: UsersService
  ) {}

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.preview = reader.result;
    };
  }

  upload() {
    this.fileInput.nativeElement.click();

    if (!this.selectedFiles) return;

    const accessToken = localStorage.getItem('_at')!;

    this.usersService.uploadUserPhoto({
      userPhoto: this.preview,
      accessToken
    }).subscribe({
      next: () => {
        //
      },
      error: () => {
        //
      }
    });

    this.selectedFiles = undefined;
  }

  ngOnInit() {
    this.userProfilePictureLink = this.isProfilePicPresent
      ? `${this.staticStorageLink}/users-profile-pictures/${this.userId}.png`
      : `${this.staticStorageLink}/users-profile-pictures/default.png`;
  }
}
