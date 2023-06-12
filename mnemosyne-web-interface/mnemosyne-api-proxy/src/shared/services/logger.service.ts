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
    action,
    method,
    event,
    status,
    payload
  }: {
    action: string;
    method: string;
    event: string;
    status: string;
    payload: any;
  }) {
    // TODO Implement logic here
    const log = new this.logger(payload);
    await log.save();
  }
}
