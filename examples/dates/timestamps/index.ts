import wormise, { wormiseDafaultDirname } from '../../../src/index.js';

export async function getCurrentDateTimestamp() {
  return await wormise(
    async () => {
      const { getDate } = await import('../index.js');
      return getDate().getTime();
    },
    wormiseDafaultDirname(import.meta.url),
    undefined,
  );
}
