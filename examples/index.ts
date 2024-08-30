import { getCurrentDateTimestamp } from './dates/timestamps/index.js';

async function run() {
  const currentDatetime = await getCurrentDateTimestamp();
  console.log(currentDatetime);
}
run();
