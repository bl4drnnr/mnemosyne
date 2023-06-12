import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class InformationLog {
  @Prop()
  actionController: string;

  @Prop()
  method: string;

  @Prop()
  eventEndpoint: string;

  @Prop()
  message: string;

  @Prop()
  status: string;

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(InformationLog);
