import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ActionController } from '@interfaces/action-controller.enum';
import { Method } from '@interfaces/methods.enum';
import { Status } from '@interfaces/statuses.enum';

@Schema()
export class InformationLog {
  @Prop()
  logType: ActionController;

  @Prop({ required: false })
  method?: Method;

  @Prop({ required: false })
  controller?: string;

  @Prop({ required: false })
  endpoint?: string;

  @Prop({ required: false })
  message?: string;

  @Prop()
  status: Status;

  @Prop({ type: Object, required: false })
  payload?: object;

  @Prop({ type: Object, required: false })
  error?: object;

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(InformationLog);
