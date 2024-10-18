import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

jest.mock('path');
jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cbMock = jest.fn();
    const spyTimeout = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(cbMock, 500);

    expect(spyTimeout).toHaveBeenCalledWith(cbMock, 500);
  });

  test('should call callback only after timeout', () => {
    const cbMock = jest.fn();
    const spyTimeout = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(cbMock, 500);
    expect(cbMock).not.toHaveBeenCalled();

    jest.runAllTimers();
    expect(spyTimeout).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cbMock = jest.fn();
    const spyInterval = jest.spyOn(global, 'setInterval');
    doStuffByInterval(cbMock, 500);

    expect(spyInterval).toHaveBeenCalledWith(cbMock, 500);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cbMock = jest.fn();
    doStuffByInterval(cbMock, 500);
    jest.advanceTimersByTime(1000);

    expect(cbMock).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    await readFileAsynchronously('file.txt');
    expect(join).toHaveBeenCalledWith(__dirname, 'file.txt');
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    const content = await readFileAsynchronously('file.txt');
    expect(content).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockReturnValue('content');

    const content = await readFileAsynchronously('file.txt');
    expect(content).toMatch('content');
  });
});
