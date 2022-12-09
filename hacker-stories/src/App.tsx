import './App.css';
import * as React from "react";
import axios from "axios";
import styled from "styled-components";
// @ts-ignore
import { InputWithLabel } from "./InputWithLabel.tsx";
import { sortBy } from "lodash";

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
const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

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
    payload: {
        list: Array<Story>,
        page: number,
    }
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
                data: action.payload.list,
                page: action.payload.page,
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

const getUrl = (searchTerm) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}`;
const extractSearchTerm = (url) =>
    url.substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
        .replace(PARAM_SEARCH, '');
const getLastSearches = (urls) => {
    return urls
        .reduce((result, url, index) => {
            const searchTerm = extractSearchTerm(url);
            if (index === 0) {
                return result.concat(searchTerm);
            }

            const previousSearchTerm = result[result.length - 1];
            if (searchTerm === previousSearchTerm) {
                return result;
            } else {
                return result.concat(searchTerm);
            }
        }, [])
        .slice(-6)
        .slice(0, -1);
};

const App = () => {
    const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], page: 0, isLoading: false, isError: false}
    );
    const [urls, setUrls] = React.useState([getUrl(searchTerm)]);
    console.log("B: App");

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });
        try {
            const lastUrl = urls[urls.length - 1]
            const result = await axios.get(lastUrl);
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: {
                    list: result.data.hits,
                    page: result.data.page,
                },
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [urls]);

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

    const handleSearch = (searchTerm) => {
        const url = getUrl(searchTerm);
        setUrls(urls.concat(url));
    }

    const handleSearchSubmit = (event) => {
        handleSearch(searchTerm);
        event.preventDefault();
    }
    const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

    const handleLastSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        handleSearch(searchTerm)
    }
    const lastSearches = getLastSearches(urls);

    return (
        <StyledContainer>
            <h1 className="headline-primary">{welcome.greeting}, {welcome.title}</h1>
            <h2>My Hacker Stories with {sumComments} comments.</h2>
            <LastSearches lastSearches={lastSearches} onLastSearch={handleLastSearch} />
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

const LastSearches = ({ lastSearches, onLastSearch }) => (
    <>
        {lastSearches.map((searchTerm, index) => (
            <button
                key={searchTerm + index}
                type="button"
                onClick={() => onLastSearch(searchTerm)}
            >
                {searchTerm}
            </button>
        ))}
    </>
)

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

const SORTS = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, 'title'),
    AUTHOR: (list) => sortBy(list, 'author'),
    COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
    POINT: (list) => sortBy(list, 'points').reverse(),
};

type ListProps = {
    list: Array<Story>,
    onRemoveItem: (item: Story) => void;
}
const List = React.memo(({ list, onRemoveItem }: ListProps) => {
    console.log("B: InputWithLabel");
    const [sort, setSort] = React.useState({
        sortKey: 'NONE',
        isReverse: false,
    });
    const handleSort = (sortKey) => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({sortKey, isReverse});
    };

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);

    return (
        <ul>
            <li style={{ display: 'flex' }}>
                <span style={{ width : '40%' }}>
                    <button onClick={() => handleSort('TITLE')}>
                        Title
                    </button>
                </span>
                <span style={{ width : '30%' }}>
                    <button onClick={() => handleSort('AUTHOR')}>
                        Author
                    </button>
                </span>
                <span style={{ width : '10%' }}>
                    <button onClick={() => handleSort('COMMENT')}>
                        Comments
                    </button>
                </span>
                <span style={{ width : '10%' }}>
                    <button onClick={() => handleSort('POINT')}>
                        Points
                    </button>
                </span>
                <span style={{ width : '10%' }}>
                    Actions
                </span>
            </li>
            {sortedList.map((item) => <Item item={item} key={item.objectID} onRemoveItem={onRemoveItem} />)}
        </ul>
    );
});

type ItemProps = {
    item: Story,
    onRemoveItem: (item: Story) => void,
};

const Item = ({ item, onRemoveItem } : ItemProps) => {
    return (
        <li className="item" style={{ display: 'flex' }}>
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

export default App;
export { storiesReducer, SearchForm, List, Item };
