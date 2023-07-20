import {BadRequestException} from "@nestjs/common";

export class LinkExpiredException extends BadRequestException {
  constructor(message = 'link-expired', description = 'Link has expired') {
    super(message, description);
  }
}
