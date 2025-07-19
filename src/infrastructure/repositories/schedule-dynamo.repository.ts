import { DynamoPrefix } from "../../domain/constants/dynamo-prefix.enum";
import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleRepositoryPort } from "../../domain/repositories/schedure-repository.port";
import { appConfig } from "../config/app.config";
import { DynamoService } from "../dynamodb/dynamo.service";

export class DynamoScheduleRepository implements ScheduleRepositoryPort {
  private readonly tableName = appConfig.tableName!;

  constructor(private readonly dynamo: DynamoService) {}

  async save(schedule: Schedule): Promise<void> {
    const item = schedule.toItem();
    await this.dynamo.put({ TableName: this.tableName, Item: item });
  }
  async listAvailable(): Promise<Schedule[]> {
    const result = await this.dynamo.scan({
      TableName: this.tableName,
      FilterExpression: "SK = :sk AND itemType = :itemType",
      ExpressionAttributeValues: {
        ":sk": `${DynamoPrefix.SCHEDULE}#${DynamoPrefix.DETAILS}`,
        ":itemType": `${DynamoPrefix.SCHEDULE}`,
      },
    });

    if (!result.Items) return [];

    return result.Items.map((item: any) => Schedule.fromItem(item));
  }
}
