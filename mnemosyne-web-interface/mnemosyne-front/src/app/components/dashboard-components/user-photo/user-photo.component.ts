import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { UsersService } from '@services/users.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslocoService } from '@ngneat/transloco';
import {ValidationService} from "@services/validation.service";

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
  showText: boolean;

  staticStorageLink = this.envService.getStaticStorageLink;

  constructor(
    private readonly envService: EnvService,
    private readonly usersService: UsersService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly translocoService: TranslocoService,
    private readonly validationService: ValidationService
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
    if (!this.selectedFiles) return;

    if (!this.isImageValid()) return this.globalMessageService.handle({
      message: this.translocoService.translate(
        'validation.user-photo-must-be-base64',
        {},
        'errors'
      ),
      isError: true
    });

    const accessToken = localStorage.getItem('_at')!;

    this.usersService
      .uploadUserPhoto({
        userPhoto: this.preview,
        accessToken
      })
      .subscribe({
        next: ({ message }) =>
          this.globalMessageService.handle({
            message: this.translocoService.translate(
              message,
              {},
              'messages/responses'
            ),
            isError: false
          })
      });

    this.selectedFiles = undefined;
  }

  isImageValid() {
    return this.validationService.checkBase64PngImage(this.preview as string);
  }

  ngOnInit() {
    this.userProfilePictureLink = this.isProfilePicPresent
      ? `${this.staticStorageLink}/users-profile-pictures/${this.userId}.png`
      : `${this.staticStorageLink}/users-profile-pictures/default.png`;
  }
}
