import { DynamoPrefix } from "../constants/dynamo-prefix.enum";

export interface ScheduleProps {
  scheduleId: number;
  centerId: number;
  specialtyId: number;
  medicId: number;
  date: Date;
}

export class Schedule {
  public readonly scheduleId: number;
  public readonly centerId: number;
  public readonly specialtyId: number;
  public readonly medicId: number;
  public readonly date: Date;

  constructor(props: ScheduleProps) {
    this.scheduleId = props.scheduleId;
    this.centerId = props.centerId;
    this.specialtyId = props.specialtyId;
    this.medicId = props.medicId;
    this.date = props.date;
  }

  getPK(): string {
    return `${DynamoPrefix.SCHEDULE}#${this.scheduleId}`;
  }

  getSK(): string {
    return `${DynamoPrefix.SCHEDULE}#${DynamoPrefix.DETAILS}`;
  }

  toItem(): Record<string, any> {
    return {
      PK: this.getPK(),
      SK: this.getSK(),
      itemType: DynamoPrefix.SCHEDULE,

      scheduleId: this.scheduleId,
      centerId: this.centerId,
      specialtyId: this.specialtyId,
      medicId: this.medicId,
      date: this.date.toISOString(),
    };
  }
  static fromItem(item: Record<string, any>): Schedule {
    return new Schedule({
      scheduleId: Number(item.scheduleId),
      centerId: Number(item.centerId),
      specialtyId: Number(item.specialtyId),
      medicId: Number(item.medicId),
      date: new Date(item.date),
    });
  }
}
