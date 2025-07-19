import { SnsNotificationService } from "../../../src/infrastructure/sns/sns-notification.service";
import { Appointment } from "../../../src/domain/entities/appointment.entity";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

jest.mock("@aws-sdk/client-sns", () => {
  const actual = jest.requireActual("@aws-sdk/client-sns");
  return {
    ...actual,
    SNSClient: jest.fn(() => ({
      send: jest.fn().mockResolvedValue({}),
    })),
    PublishCommand: jest.fn(),
  };
});

describe("SnsNotificationService", () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.SNS_TOPIC_PE = "arn:aws:sns:us-east-1:123456789012:topic-pe";
    process.env.SNS_TOPIC_CL = "arn:aws:sns:us-east-1:123456789012:topic-cl";

    (SNSClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
  });

  it("debería enviar un mensaje al topic de PE", async () => {
    const appointment = new Appointment({
      appointmentId: "1",
      insuredId: "100",
      scheduleId: 4554,
      description: "Consulta médica",
      countryISO: "PE",
    });

    const service = new SnsNotificationService();
    await service.notify(appointment);

    expect(PublishCommand).toHaveBeenCalledWith({
      TopicArn: process.env.SNS_TOPIC_PE,
      Message: JSON.stringify(appointment),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: "PE",
        },
      },
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("debería enviar un mensaje al topic de CL", async () => {
    const appointment = new Appointment({
      appointmentId: "2",
      insuredId: "101",
      scheduleId: 5453,
      description: "Consulta en Chile",
      countryISO: "CL",
    });

    const service = new SnsNotificationService();
    await service.notify(appointment);

    expect(PublishCommand).toHaveBeenCalledWith({
      TopicArn: process.env.SNS_TOPIC_CL,
      Message: JSON.stringify(appointment),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: "CL",
        },
      },
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
