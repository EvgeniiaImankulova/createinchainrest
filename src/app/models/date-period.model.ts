export type DatePeriodType = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface DatePeriod {
  type: DatePeriodType;
  startDate: Date;
  endDate: Date;
}
