import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ACTION_CONTROLLER_TYPE } from '@interfaces/action-controller.type';
import { METHODS_TYPE } from '@interfaces/method.type';
import { STATUS_TYPE } from '@interfaces/status.type';

@Schema()
export class InformationLog {
  @Prop({ required: false })
  logType?: ACTION_CONTROLLER_TYPE;

  @Prop({ required: false })
  method?: METHODS_TYPE;

  @Prop({ required: false })
  controller?: string;

  @Prop({ required: false })
  endpoint?: string;

  @Prop({ required: false })
  message?: string;

  @Prop({ required: false })
  status?: STATUS_TYPE;

  @Prop({ type: String, required: false })
  payload?: string;

  @Prop({ required: false })
  timestamp?: Date;
}

export const LogSchema = SchemaFactory.createForClass(InformationLog);
