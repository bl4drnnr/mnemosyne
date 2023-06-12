import { Injectable } from '@nestjs/common';
import { InjectModel as InjectModelMongo } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InformationLog } from '@schemas/log.schema';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModelMongo(InformationLog.name)
    private readonly logger: Model<InformationLog>
  ) {}

  async log({
    actionController,
    method,
    eventEndpoint,
    message,
    status,
    payload
  }: {
    actionController: string | 'LOGGER_SERVICE' | 'PROXY_SERVICE';
    method?: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';
    eventEndpoint: string | 'LOGGER_SERVICE' | 'PROXY_SERVICE';
    message?: string;
    status: 'SUCCESS' | 'ERROR';
    payload?: any;
  }) {
    // TODO Implement more sophisticated functionality here
    const log = new this.logger({
      actionController,
      method,
      eventEndpoint,
      message,
      status
    });
    await log.save();
  }
}
