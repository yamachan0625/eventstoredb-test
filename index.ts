import {
  EventStoreDBClient,
  JSONEventType,
  jsonEvent,
} from '@eventstore/db-client';
import { v4 as uuid } from 'uuid';

const STREAM_NAME = 'test-stream';
const client = EventStoreDBClient.connectionString(
  'esdb://127.0.0.1:2113?tls=false'
);

type TestEvent = JSONEventType<
  'TestEvent',
  {
    entityId: string;
    importantData: string;
  }
>;

const event = jsonEvent<TestEvent>({
  id: 'vrwebrw-brwbn',
  type: 'TestEvent',
  data: {
    entityId: uuid(),
    importantData: 'I wrote my first event!',
  },
});

(async () => {
  try {
    client
      .appendToStream(STREAM_NAME, event)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });

    // const events = client.readStream<TestEvent>(STREAM_NAME, {
    //   direction: 'backwards',
    //   fromRevision: BigInt(10),
    //   maxCount: 3,
    // });

    // for await (const resolvedEvent of events) {
    //   console.log(resolvedEvent.event);
    // }
  } catch (error) {
    console.log(error);
  }
})();
