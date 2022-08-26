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

const App = () => {
    const [searchTerm, setSearchTerm] = useStorageState('search', 'React')

    const stories = [
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
        }
    ]
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
           label="Search: "
           value={searchTerm}
           onInputChange={handleSearch}
       />
       <div>Exponential Numbers: {JSON.stringify(exponentialNumbers)}</div>
       <List list={searchedStories} />
   </div>
  );
}

const List = (props) => {
    return (
        <ul>
            {props.list.map(({ objectID, ...item }) => <Item {...item} key={objectID} />)}
        </ul>
    );
}

const Item = ({ title, url, author, num_comments, points }) => {
    return (
        <li>
            <span><a href={url}>{title}</a></span>
            <span>{author}</span>
            <span>{num_comments}</span>
            <span>{points}</span>
        </li>
    );
}

const InputWithLabel = ({
    id,
    label,
    type = 'text',
    value,
    onInputChange
}) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input id={id} type={type} value={value} onChange={onInputChange} />
        </div>
    );
}

export default App;
