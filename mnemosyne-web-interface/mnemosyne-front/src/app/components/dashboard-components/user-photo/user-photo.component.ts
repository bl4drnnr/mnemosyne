import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { UsersService } from '@services/users.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { ValidationService } from '@services/validation.service';
import { TranslationService } from '@services/translation.service';
import { MessagesTranslation } from '@translations/messages.enum';

@Component({
  selector: 'dashboard-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.scss']
})
export class UserPhotoComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @Input() userIdHash: string;

  selectedFiles?: FileList;
  preview: string | ArrayBuffer | null = '';
  userProfilePictureLink: string;
  defaultUserProfilePictureLink: string;
  showText: boolean;

  staticStorageLink = this.envService.getStaticStorageLink;

  constructor(
    private readonly envService: EnvService,
    private readonly usersService: UsersService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly translationService: TranslationService,
    private readonly validationService: ValidationService
  ) {}

  selectFile(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.preview = reader.result;
    };
  }

  async upload() {
    if (!this.selectedFiles) return;

    if (!this.isImageValid()) {
      await this.globalMessageService.handleError({
        message: 'validation.user-photo-must-be-base64'
      });
    }

    this.usersService.uploadUserPhoto({ userPhoto: this.preview }).subscribe({
      next: async ({ message }) => {
        const globalMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: globalMessage
        });
      }
    });

    this.selectedFiles = undefined;
  }

  isImageValid() {
    return this.validationService.checkBase64PngImage(this.preview as string);
  }

  onImgError(event: any) {
    event.target.src = this.defaultUserProfilePictureLink;
  }

  ngOnInit() {
    this.userProfilePictureLink = `${this.staticStorageLink}/users-profile-pictures/${this.userIdHash}.png`;
    this.defaultUserProfilePictureLink = `${this.staticStorageLink}/users-profile-pictures/default.png`;
  }
}
