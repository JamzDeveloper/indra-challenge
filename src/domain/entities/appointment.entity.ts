import { CreateAppointmentInput } from "../../application/dtos/create-appointment.input";
import { DynamoPrefix } from "../constants/dynamo-prefix.enum";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type AppointmentCountryISOType = "PE" | "CL";
export interface AppointmentProps {
  insuredId: string;
  appointmentId: string;
  scheduleId: number;

  description?: string;
  status?: AppointmentStatus | null;
  createdAt?: Date;
  updatedAt?: Date;
  countryISO: AppointmentCountryISOType;
  email?: string | null;
}

export class Appointment {
  public readonly insuredId: string;
  public readonly appointmentId: string;
  public readonly scheduleId: number;

  public readonly description?: string | null;
  public readonly countryISO: AppointmentCountryISOType;
  public readonly email?: string | null;
  private status: AppointmentStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: AppointmentProps) {
    this.insuredId = props.insuredId;
    this.appointmentId = props.appointmentId;
    this.scheduleId = props.scheduleId;
    this.description = props.description ?? null;
    this.status = props.status ?? "PENDING";
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this.countryISO = props.countryISO;
    this.email = props.email ?? null;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public completeAppointment(): void {
    if (this.status === "COMPLETED") return;
    this.status = "COMPLETED";
    this._updatedAt = new Date();
  }

  public getStatus() {
    return this.status;
  }

  public isCompleted(): boolean {
    return this.status === "COMPLETED";
  }

  getPK(): string {
    return `${DynamoPrefix.INSURED}#${this.insuredId}`;
  }

  getSK(): string {
    return `${DynamoPrefix.APPOINTMENT}#${this.appointmentId}`;
  }

  getGSI1PK(): string {
    return `${DynamoPrefix.SCHEDULE}#${this.scheduleId}`;
  }

  getGSI1SK(): string {
    return `${DynamoPrefix.APPOINTMENT}#${this.appointmentId}`;
  }

  toItem(): Record<string, any> {
    return {
      PK: this.getPK(),
      SK: this.getSK(),
      itemType: DynamoPrefix.APPOINTMENT,

      appointmentId: this.appointmentId,
      scheduleId: this.scheduleId,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      email: this.email,
      GSI1PK: this.getGSI1PK(),
      GSI1SK: this.getGSI1SK(),
    };
  }
  toInput(): CreateAppointmentInput {
    return {
      scheduleId: this.scheduleId,
      countryISO: this.countryISO,
      insuredId: this.insuredId,
      description: this.description,
      status: this.status,
      email: this.email ?? null,
    };
  }
  static fromItem(item: Record<string, any>): Appointment {
    return new Appointment({
      insuredId: item.PK.replace(`${DynamoPrefix.INSURED}#`, ""),
      appointmentId: item.appointmentId,
      scheduleId: item.scheduleId,
      description: item.description ?? null,
      status: item.status as AppointmentStatus,
      createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
      countryISO: item.countryISO as AppointmentCountryISOType,
      email: item.email ?? null,
    });
  }
}
