import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ActionControllerEnum } from '@interfaces/action-controller.enum';
import { MethodsEnum } from '@interfaces/methods.enum';
import { StatusesEnum } from '@interfaces/statuses.enum';

@Schema()
export class InformationLog {
  @Prop()
  logType: ActionControllerEnum;

  @Prop({ required: false })
  method?: MethodsEnum;

  @Prop({ required: false })
  controller?: string;

  @Prop({ required: false })
  endpoint?: string;

  @Prop({ required: false })
  message?: string;

  @Prop()
  status: StatusesEnum;

  @Prop({ type: Object, required: false })
  payload?: object;

  @Prop({ type: Object, required: false })
  error?: object;

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(InformationLog);
