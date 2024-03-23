import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslationService } from '@services/translation.service';
import { MessagesTranslation } from '@translations/messages.enum';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactEmail: string;
  incorrectContactEmail: boolean;
  contactMessage: string;
  incorrectContactMessage: boolean;

  constructor(
    private readonly translationService: TranslationService,
    private readonly authenticationService: AuthenticationService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  sendContactMessage() {
    if (!this.disableSentButton()) {
      this.authenticationService
        .contactUs({
          contactEmail: this.contactEmail,
          contactMessage: this.contactMessage
        })
        .subscribe({
          next: async ({ message }) => {
            const globalMessage = await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
            this.globalMessageService.handle({
              message: globalMessage
            });
            this.contactEmail = '';
            this.incorrectContactEmail = false;
            this.contactMessage = '';
            this.incorrectContactMessage = false;
          }
        });
    }
  }

  disableSentButton() {
    return (
      !this.contactEmail ||
      !this.contactMessage ||
      this.incorrectContactEmail ||
      this.incorrectContactMessage
    );
  }

  ngOnInit() {
    this.translationService.setPageTitle(Titles.CONTACT);
  }
}
