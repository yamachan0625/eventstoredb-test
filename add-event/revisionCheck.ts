import {
  AppendExpectedRevision,
  EventStoreDBClient,
  JSONEventType,
  jsonEvent,
} from '@eventstore/db-client';
import { v4 as uuid } from 'uuid';

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
    const events = client.readStream<TestEvent>(STREAM_NAME, {
      // direction: 'backwards',
      // fromRevision: BigInt(10),
      // maxCount: 3,
    });

    let revision: AppendExpectedRevision = 'any';
    for await (const { event } of events) {
      console.log(event?.revision);
      revision = event?.revision ?? revision;
    }

    const clientOneEvent = jsonEvent<TestEvent>({
      id: uuid(),
      type: 'TestEvent',
      data: {
        entityId: '1',
        importantData: `I wrote my first event!${revision}`,
      },
    });

    console.log('fix', revision);
    await client.appendToStream(STREAM_NAME, clientOneEvent, {
      expectedRevision: revision,
    });

    const clientTwoEvent = jsonEvent<TestEvent>({
      id: uuid(),
      type: 'TestEvent',
      data: {
        entityId: '2',
        importantData: `I wrote my first event!${revision}`,
      },
    });

    // https://developers.eventstore.com/clients/grpc/appending-events.html#handling-concurrency
    await client.appendToStream(STREAM_NAME, clientTwoEvent, {
      expectedRevision: revision, // 同一のrevisionであるため、追加できない。楽観ロック
    });
  } catch (error) {
    console.log(error);
  }
})();
