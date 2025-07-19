
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { Appointment } from "../../domain/entities/appointment.entity";
import { NotificationServicePort } from "../../domain/ports/notification-service.port";

export class SnsNotificationService implements NotificationServicePort {
  private readonly sns = new SNSClient({ region: process.env.AWS_REGION });

  async notify(appointment: Appointment): Promise<void> {
    const countryISO = appointment.countryISO;

    const topicArn =
      countryISO === "PE" ? process.env.SNS_TOPIC_PE : process.env.SNS_TOPIC_CL;

    await this.sns.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(appointment),
        MessageAttributes: {
          countryISO: {
            DataType: "String",
            StringValue: countryISO,
          },
        },
      })
    );
  }
}
