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
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { stories: initialStories }}), 1000);
    });
}

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STORIES':
            return action.payload;
        case 'REMOVE_STORIES':
            return state.filter((story) => action.payload.objectID !== story.objectID);
        default:
            throw new Error();
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
    const [stories, dispatchStories] = React.useReducer(storiesReducer, []);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    React.useEffect(() => {
        setIsLoading(true);
        getAsyncStories().then(result => {
            dispatchStories({
                type: 'SET_STORIES',
                payload: result.data.stories,
            });
            setIsLoading(false);
        }).catch(() => {
            setIsError(true);
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
    const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

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
       {isError && <p>Something went wrong...</p>}
       {isLoading ? (<p>Loading...</p>) :
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
