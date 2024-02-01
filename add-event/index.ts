import {
  EventStoreDBClient,
  JSONEventType,
  jsonEvent,
} from '@eventstore/db-client';
import { v4 as uuid } from 'uuid';

const client = EventStoreDBClient.connectionString(
  'esdb://127.0.0.1:2113?tls=false'
);

type SomeEvent = JSONEventType<
  'some-event',
  {
    id: string;
    value: string;
  }
>;

const eventOne = jsonEvent<SomeEvent>({
  id: uuid(),
  type: 'some-event',
  data: {
    id: '1',
    value: 'some value',
  },
});

const eventTwo = jsonEvent<SomeEvent>({
  id: uuid(),
  type: 'some-event',
  data: {
    id: '2',
    value: 'some other value',
  },
});

(async () => {
  try {
    await client.appendToStream('no-stream-stream', eventOne, {
      expectedRevision: 'no_stream',
    });

    // attempt to append the same event again
    await client.appendToStream('no-stream-stream', eventTwo, {
      expectedRevision: 'no_stream', // 同一のストリームを作成することはできない
    });
  } catch (error) {
    console.log(error);
  }
})();
