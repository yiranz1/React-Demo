import './App.css';
import { useState, useEffect } from "react";

const welcome = {
    greeting: 'Hello',
    title: 'Yiran',
};

const numbers = [1, 2, 3, 4];
const exponentialNumbers = numbers.map((number) => number * number);


const App = () => {
    const [searchTerm, setSearchTerm] = useState(
        localStorage.getItem('search') || 'React'
    );

    useEffect(() => {
        localStorage.setItem('search', searchTerm);
    }, [searchTerm]);

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
       <Search search={searchTerm} onSearch={handleSearch} />
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

const Search = ({ search, onSearch }) => {
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" value={search} onChange={onSearch} />
        </div>
    );
}

export default App;
