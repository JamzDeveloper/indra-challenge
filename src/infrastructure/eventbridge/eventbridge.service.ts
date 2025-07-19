import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

export class EventBridgeService {
  private readonly client = new EventBridgeClient({});

  async emitDetail(
    detail: object,
    detailType: string,
    source: string,
    eventBusName?: string
  ) {
    console.log("call event bridge", {
      detail,
      detailType,
      source,
      eventBusName,
    });
    const command = new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify(detail),
          DetailType: detailType,
          Source: source,
          EventBusName: eventBusName || "default",
        },
      ],
    });

    await this.client.send(command);
  }
}
