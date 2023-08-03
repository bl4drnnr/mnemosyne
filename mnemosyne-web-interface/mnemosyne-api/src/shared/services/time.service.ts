import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { TimeframeInterface } from '@interfaces/timeframe.interface';

@Injectable()
export class TimeService {
  isWithinTimeframe({ time, seconds }: TimeframeInterface) {
    const currentTime = dayjs();
    const sentDateTime = dayjs(time);

    const diffInMinutes = currentTime.diff(sentDateTime, 'seconds');
    return diffInMinutes <= seconds;
  }
}
