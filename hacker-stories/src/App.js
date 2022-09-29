import './App.css';
import React from "react";

const welcome = {
    greeting: 'Hello',
    title: 'Yiran',
};

const numbers = [1, 2, 3, 4];
const exponentialNumbers = numbers.map((number) => number * number);

const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}

const initialStories = [
    {
        title: 'React',
        url: 'https://reactjs.org',
        author: 'Jordan Walke',
        points: 5,
        num_comments: 3,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://redux.js.org',
        author: 'Dan',
        points: 6,
        num_comments: 2,
        objectID: 1,
    },
    {
        title: 'Django',
        url: 'https://django.com',
        author: 'HHHHH',
        points: 9,
        num_comments: 3,
        objectID: 2,
    },
];

const getAsyncStories = () => {
    return new Promise((resolve, reject) => {
        // setTimeout(reject, 2000);
        setTimeout(() => resolve({ data: { stories: initialStories }}), 1000);
    });
}

const storiesReducer = (state, action) => {
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

const App = () => {
    const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );

    React.useEffect(() => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });
        getAsyncStories().then(result => {
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.stories,
            });
        }).catch(() => {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        })
    }, []);

    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORIES',
            payload: item,
        });
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        console.log(searchTerm);
    }
    const searchedStories = stories.data.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
   <div>
     <h1>{welcome.greeting}, {welcome.title}</h1>
       <InputWithLabel
           id="search"
           value={searchTerm}
           onInputChange={handleSearch}
       >
           <strong>Search: </strong>
       </InputWithLabel>
       <div>Exponential Numbers: {JSON.stringify(exponentialNumbers)}</div>
       {stories.isError && <p>Something went wrong...</p>}
       {stories.isLoading ? (<p>Loading...</p>) :
           (<List list={searchedStories} onRemoveItem={handleRemoveStory} />)
       }

   </div>
  );
}

const List = ({ list, onRemoveItem }) => {
    return (
        <ul>
            {list.map((item) => <Item item={item} key={item.objectID} onRemoveItem={onRemoveItem} />)}
        </ul>
    );
}

const Item = ({ item, onRemoveItem }) => {
    return (
        <li>
            <span><a href={item.url}>{item.title}</a></span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
                <button type="button" onClick={() => onRemoveItem(item)}>
                    Dismiss
                </button>
            </span>
        </li>
    );
}

const InputWithLabel = ({
    id,
    children,
    type = 'text',
    value,
    onInputChange
}) => {
    return (
        <div>
            <label htmlFor={id}>{children}</label>
            <input id={id} type={type} value={value} onChange={onInputChange} />
        </div>
    );
}

export default App;
