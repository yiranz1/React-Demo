import {fireEvent, render, screen, act} from '@testing-library/react';
import * as React from 'react';
import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel
} from './App';
import axios from 'axios';

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

jest.mock('axios');

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

describe("SearchForm", () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  test("renders the input field with its value", () => {
    render(<SearchForm {...searchFormProps} />);
    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  test("calls onSearchInput on input field change", () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.change(screen.getByDisplayValue("React"), {
      target: { value: "Redux" }
    });
    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  test("calls onSearchSubmit on button submit click", () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.submit(screen.getByRole('button'));
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("App", () => {
  test("succeeds fetching data", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      }
    });

    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    screen.debug();
    await act(() => promise);
    screen.debug()
  })
})
