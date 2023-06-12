import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class InformationLog {
  @Prop()
  event: string;

  @Prop()
  message: string;

  @Prop()
  status: string;

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(InformationLog);
