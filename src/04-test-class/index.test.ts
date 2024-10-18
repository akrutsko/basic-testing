import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  type BankAccount,
} from '.';

jest.mock('lodash', () => ({ random: () => 50 }));

let account: BankAccount;

describe('BankAccount', () => {
  beforeEach(() => {
    account = getBankAccount(100);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const transfer = getBankAccount(100);

    expect(() => account.transfer(200, transfer)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(200, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    expect(account.deposit(200).getBalance()).toBe(300);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(50).getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const transfer = getBankAccount(100);
    account.transfer(50, transfer);

    expect(account.getBalance()).toBe(50);
    expect(transfer.getBalance()).toBe(150);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await account.fetchBalance();

    expect(typeof balance).toMatch('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    account.fetchBalance = jest.fn().mockResolvedValue(50);
    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    account.fetchBalance = jest.fn().mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
