import axios, { type AxiosInstance } from 'axios';

import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => ({
  throttle: jest.fn().mockImplementation((f) => f),
}));

let axiosInstance: AxiosInstance;
let createSpy: jest.SpyInstance;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    axiosInstance = {
      get: jest.fn().mockResolvedValue({ data: 'test' }),
    } as unknown as AxiosInstance;
    createSpy = jest.spyOn(axios, 'create').mockReturnValue(axiosInstance);
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('users');

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('users');

    expect(axiosInstance.get).toHaveBeenCalledWith('users');
  });

  test('should return response data', async () => {
    const data = await throttledGetDataFromApi('users');

    expect(data).toMatch('test');
  });
});
