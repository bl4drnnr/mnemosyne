import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '@exceptions/validation.exception';
import { Transaction } from 'sequelize';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    let object: any;

    if (value instanceof Transaction || typeof value === 'string') return value;
    else object = plainToInstance(metadata.metatype, value);

    const errors = await validate(object);

    if (errors.length) {
      const messages = errors.map((err) => {
        return {
          property: err.property,
          error: Object.values(err.constraints)
        };
      });
      throw new ValidationException(messages);
    }

    return object;
  }
}
