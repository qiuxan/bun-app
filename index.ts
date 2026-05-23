import concurrently from 'concurrently';

concurrently([
   {
      command: 'bun run dev',
      cwd: 'packages/client',
      prefixColor: 'cyan',
   },
   {
      command: 'bun run dev',
      cwd: 'packages/server',
      prefixColor: 'green',
   },
]);
