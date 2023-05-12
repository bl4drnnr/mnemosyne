import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '@exceptions/validation/validation.exception';

export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length) {
      const messages = errors.map((err) => {
        return {
          property: err.property,
          error: Object.values(err.constraints).join(', ')
        };
      });
      throw new ValidationException(messages);
    }

    return object;
  }
}
