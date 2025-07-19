import { DynamoPrefix } from "../../domain/constants/dynamo-prefix.enum";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepositoryPort } from "../../domain/repositories/appointment-repository.port";
import { appConfig } from "../config/app.config";
import { DynamoService } from "../dynamodb/dynamo.service";

export class DynamoAppointmentRepository implements AppointmentRepositoryPort {
  private readonly tableName = appConfig.tableName!;

  constructor(private readonly dynamo: DynamoService) {}

  async save(appointment: Appointment): Promise<void> {
    const item = appointment.toItem();

    await this.dynamo.put({
      TableName: this.tableName,
      Item: item,
    });
  }

  async getByInsuredId(insuredId: string): Promise<Appointment[]> {
    const pk = `${DynamoPrefix.INSURED}#${insuredId}`;

    const result = await this.dynamo.query({
      TableName: this.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":sk": `${DynamoPrefix.APPOINTMENT}#`,
      },
    });
    const items = result?.Items ?? [];

    return items.map((item) => Appointment.fromItem(item));
  }

  async updateStatus(
    appointmentId: string,
    status: string,
    insuredId: string
  ): Promise<void> {
  
    await this.dynamo.update({
      TableName: this.tableName,
      Key: {
        PK: `${DynamoPrefix.INSURED}#${insuredId}`,
        SK: `${DynamoPrefix.APPOINTMENT}#${appointmentId}`,
      },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
      },
    });
  }
}
