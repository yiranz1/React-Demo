import {fireEvent, render, screen} from '@testing-library/react';
import * as React from 'react';
import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel
} from './App';

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action = {
      type: 'REMOVE_STORY',
      payload: storyOne,
    };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);
    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toEqual(expectedState);
  });
});

describe("Item", () => {
  test("renders all properties", () => {
    render(<Item item={storyOne} onRemoveItem={() => {console.log('')}} />);

    expect(screen.getByText('Jordan')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
        'href',
        'https://reactjs.org/'
    );
  });

  test("clicking the dismiss button calls the callback handler", () => {
    const handleRemoveItem = jest.fn();
    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});
