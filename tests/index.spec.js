'use strict';

const test = require('tape');
const wait = require('../index');

test('wait returns a stream object', (t) => {
  t.plan(1);
  const res = wait();

  t.ok(res instanceof require('stream').Stream, 'is instanceof Stream');
});

test('waits 1 second before returning if no params are given', (t) => {
  t.plan(1);

  const stream = wait();
  const now = Date.now();

  stream.on('data', () => {
    const time = Date.now() - now;
    t.ok(time < 1200 && time > 800, 'Waits for 1 second');
    t.end();
  });

  stream.write(null);

});

test('Accurately waits before calling the cb if given a number', (t) => {
  t.plan(1);

  const stream = wait(100);
  const now = Date.now();

  stream.on('data', () => {
    const time = Date.now() - now;
    t.ok(time < 120 && time > 80, 'Waits for 150ms');
    t.end();
  });

  stream.write(null);
});

test('Waits until callback returns truthy before calling resuming stream', (t) => {

  let num = 100;

  const stream = wait(() => {
    num--;
    return num === 0;
  });

  stream.on('data', () => {
    t.ok(true, 'Accepts function for timeout');
    t.end();
  });

  stream.write(null);
});

test('Defaults to callback if both cb and time are passed in', (t) => {

  let num = 100;

  const stream = wait({
    time: 5000,
    callback() {
      num--;
      return num === 0;
    }
  });

  stream.on('data', () => {
    t.ok(true, 'Defaults to callback');
    t.end();
  });

  stream.write(null);
});

test('Runs the `before` callback when using time', (t) => {

  let result = false;

  const stream = wait({
    time: 100,
    before() {
      result = true;
    }
  });

  stream.on('data', () => {
    t.ok(result === true, 'Sets variable from `before` callback');
    t.end();
  });

  stream.write(null);
});

test('Runs the `after` callback when using time', (t) => {

  let after_result = false;

  const stream = wait({
    time: 100,
    after: () => {
      after_result = true;
    }
  });

  stream.write(null);

  // wait for stream to finish
  setTimeout(() => {
    t.ok(after_result === true, 'Sets variable from `after` callback');
    t.end();
  }, 200)
});

test('Runs the `before` callback when using callback', (t) => {

  let result = false;

  const stream = wait({
    callback: () => true,
    before() {
      result = true;
    }
  });

  stream.on('data', () => {
    t.ok(result === true, 'Sets variable from `before` callback');
    t.end();
  });

  stream.write(null);
});

test('Runs the `after` callback when using callback', (t) => {

  let after_result = false;

  const stream = wait({
    callback: () => true,
    after: () => {
      after_result = true;
    }
  });

  stream.write(null);

  // wait for stream to finish
  setTimeout(() => {
    t.ok(after_result === true, 'Sets variable from `after` callback');
    t.end();
  }, 200)
});
