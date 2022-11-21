import './App.css';
import * as React from "react";
import axios from "axios";
import styled from "styled-components";

type Story = {
    objectID: string,
    url: string,
    title: string,
    author: string,
    num_comments: number,
    points: number,
};

const welcome = {
    greeting: 'Hello',
    title: 'Yiran',
};

const numbers = [1, 2, 3, 4];
const exponentialNumbers = numbers.map((number) => number * number);
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}

interface StoriesFetchInitAction {
    type: 'STORIES_FETCH_INIT',
}

interface StoriesFetchSuccessAction {
    type: 'STORIES_FETCH_SUCCESS',
    payload: Array<Story>,
}

interface StoriesFetchFailureAction {
    type: 'STORIES_FETCH_FAILURE',
}

interface StoriesRemoveAction {
    type: 'REMOVE_STORY',
    payload: Story,
}

type StoriesAction =
    | StoriesFetchInitAction
    | StoriesFetchSuccessAction
    | StoriesFetchFailureAction
    | StoriesRemoveAction;

const storiesReducer = (state, action: StoriesAction) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter((story) => action.payload.objectID !== story.objectID),
            };
        default:
            throw new Error();
    }
}

const StyledContainer = styled.div`
    height: 100vw;
    padding: 20px;
    background: #83a4d4;
    background: linear-gradient(to left, #b6fbff, #83a4d4);
    color: #171212;
`;

const StyledButton = styled.button`
    background: transparent;
    border: 1px solid #171212;
    padding: 5px;
    cursor: pointer;
    transition: all 0.1s ease-in;
    
    &:hover {
        background: #171212;
        color: #ffffff;
    }
`;

const StyledButtonSmall = styled(StyledButton)`
    padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
    padding: 10px;
`;

const getSumComments = (stories) => {
    console.log('C');
    return stories.data.reduce((result, value) => result + value.num_comments, 0);
}

const App = () => {
    const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );
    const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
    console.log("B: App");

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });
        try {
            const result = await axios.get(url);
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            console.log("Should be here");
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = React.useCallback((item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    }, []);

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleSearchSubmit = (event) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        event.preventDefault();
    }
    const sumComments = React.useMemo(() => getSumComments(stories), [stories]);
    console.log(stories.isError);

  return (
   <StyledContainer>
     <h1 className="headline-primary">{welcome.greeting}, {welcome.title}</h1>
       <h2>My Hacker Stories with {sumComments} comments.</h2>
       <SearchForm
           searchTerm={searchTerm}
           onSearchInput={handleSearchInput}
           onSearchSubmit={handleSearchSubmit}
       />
       <div>Exponential Numbers: {JSON.stringify(exponentialNumbers)}</div>
       {stories.isError && <p>Something went wrong...</p>}
       {stories.isLoading ? (<p>Loading...</p>) :
           (<List list={stories.data} onRemoveItem={handleRemoveStory} />)
       }

   </StyledContainer>
  );
}

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit
}) => (
    <form onSubmit={onSearchSubmit} className="search-form">
        <InputWithLabel
            id="search"
            value={searchTerm}
            onInputChange={onSearchInput}
        >
            <strong>Search: </strong>
        </InputWithLabel>
        <StyledButtonLarge
            type="submit"
            disabled={!searchTerm}
        >
            Submit
        </StyledButtonLarge>
    </form>
);

type ListProps = {
    list: Array<Story>,
    onRemoveItem: (item: Story) => void;
}
const List = React.memo(({ list, onRemoveItem }: ListProps) => {
    console.log("B: List");
    return (
        <ul>
            {list.map((item) => <Item item={item} key={item.objectID} onRemoveItem={onRemoveItem} />)}
        </ul>
    );
});

type ItemProps = {
    item: Story,
    onRemoveItem: (item: Story) => void,
};

const Item = ({ item, onRemoveItem } : ItemProps) => {
    return (
        <li className="item">
            <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}>
                <StyledButtonSmall
                    type="button"
                    onClick={() => onRemoveItem(item)}
                >
                    Dismiss
                </StyledButtonSmall>
            </span>
        </li>
    );
}

type InputWithLabelProps = {
    id: string,
    value: string,
    type?: string,
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    children: React.ReactNode,
}

const InputWithLabel = ({
    id,
    children,
    type = 'text',
    value,
    onInputChange
}: InputWithLabelProps) => {
    return (
        <div>
            <label htmlFor={id} className="label">{children}</label>
            <input id={id} type={type} value={value} onChange={onInputChange} className="input" />
        </div>
    );
}

export default App;
export { storiesReducer, SearchForm, InputWithLabel, List, Item };
