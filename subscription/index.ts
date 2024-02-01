import {
  AppendExpectedRevision,
  EventStoreDBClient,
  JSONEventType,
  jsonEvent,
  persistentSubscriptionToStreamSettingsFromDefaults,
} from '@eventstore/db-client';

type TestEvent = JSONEventType<
  'TestEvent',
  {
    entityId: string;
    importantData: string;
  }
>;

const STREAM_NAME = 'test-stream';
const client = EventStoreDBClient.connectionString(
  'esdb://127.0.0.1:2113?tls=false'
);

(async () => {
  try {
    await client.createPersistentSubscriptionToStream(
      STREAM_NAME,
      'GROUP_NAME',
      persistentSubscriptionToStreamSettingsFromDefaults(),
      { credentials: { username: 'admin', password: 'changeit' } }
    );

    const subscription =
      client.subscribeToPersistentSubscriptionToStream<TestEvent>(
        STREAM_NAME,
        'GROUP_NAME'
      );
    // const subscription = client.subscribeToStream<TestEvent>(STREAM_NAME);

    for await (const resolvedEvent of subscription) {
      // console.log(
      //   `Received event ${resolvedEvent.event?.revision}@${resolvedEvent.event?.streamId}`
      // );
      console.log(resolvedEvent);
    }
  } catch (error) {
    console.log(error);
  }
})();
