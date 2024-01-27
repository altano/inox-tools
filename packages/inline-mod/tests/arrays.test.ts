import { test, expect } from 'vitest';
import { inspectInlineMod } from '../src/inlining.js';

test('nested arrays', async () => {
  const module = await inspectInlineMod({
    defaultExport: [123, [456], 789],
  });

  expect(module.text).toEqualIgnoringWhitespace(`
    const __defaultExport_1 = [456];
    const __defaultExport = [];
    __defaultExport[0] = 123;
    __defaultExport[1] = __defaultExport_1;
    __defaultExport[2] = 789;

    export default __defaultExport;
  `);
});

test('sparse arrays', async () => {
  const array = new Array(200);

  array[50] = 123;
  array[199] = true;

  const module = await inspectInlineMod({
    defaultExport: array,
  });

  expect(module.text).toEqualIgnoringWhitespace(`
    const __defaultExport = [];
    __defaultExport[50] = 123;
    __defaultExport[199] = true;

    export default __defaultExport;
  `);
});

test.skip('circular arrays', async () => {
  const array: any[] = [];
  array.push(array);

  const module = await inspectInlineMod({
    defaultExport: array,
  });

  expect(module.text).toEqualIgnoringWhitespace(`
    const __defaultExport_1 = [];
    __defaultExport_1[0] = 123;
    __defaultExport_1[1] = __defaultExport_1;

    export default __defaultExport;
  `);
});

test('arrays with properties', async () => {
  const array = [123];
  (array as any).foo = 'bar';
  // (array as any)['weird:prop'] = 'baz';

  const module = await inspectInlineMod({
    defaultExport: array,
  });

  expect(module.text).toEqualIgnoringWhitespace(`
    const __defaultExport = [];
    __defaultExport[0] = 123;
    __defaultExport.foo = "bar";

    export default __defaultExport;
  `);
});

