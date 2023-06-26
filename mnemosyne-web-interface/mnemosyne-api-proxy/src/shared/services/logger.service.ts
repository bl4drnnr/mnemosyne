import { Injectable } from '@nestjs/common';
import { InjectModel as InjectModelMongo } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InformationLog } from '@schemas/log.schema';
import { LogActionInterface } from '@interfaces/log-action.interface';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModelMongo(InformationLog.name)
    private readonly logger: Model<InformationLog>
  ) {}

  async handleLogAction({
    logType,
    method,
    controller,
    endpoint,
    message,
    status,
    payload
  }: LogActionInterface) {
    delete payload.body['password'];

    await this.log({
      logType,
      method,
      controller,
      endpoint,
      message,
      status,
      payload
    });
  }

  async log({
    logType,
    method,
    controller,
    endpoint,
    message,
    status,
    payload
  }: LogActionInterface) {
    const log = new this.logger({
      logType,
      method,
      controller,
      endpoint,
      message,
      status,
      payload
    });
    await log.save();
  }
}
