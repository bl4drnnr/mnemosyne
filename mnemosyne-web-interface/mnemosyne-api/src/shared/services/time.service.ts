import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  isWithinTimeframe({ time, seconds }: { time: Date; seconds: number }) {
    const currentTime = dayjs();
    const sentDateTime = dayjs(time);

    const diffInMinutes = currentTime.diff(sentDateTime, 'seconds');
    return diffInMinutes <= seconds;
  }
}
