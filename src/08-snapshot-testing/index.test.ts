import { generateLinkedList } from './index';

const elements = [1, 2, 3];
const linkedList = {
  next: {
    next: {
      next: {
        next: null,
        value: null,
      },
      value: 3,
    },
    value: 2,
  },
  value: 1,
};

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(elements)).toStrictEqual(linkedList);
  });

  test('should generate linked list from values 2', () => {
    const linkedList = generateLinkedList(elements);
    expect(linkedList).toMatchSnapshot();
  });
});
