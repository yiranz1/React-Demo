import './App.css';
import {useState} from "react";

const welcome = {
    greeting: 'Hello',
    title: 'Yiran',
};

const numbers = [1, 2, 3, 4];
const exponentialNumbers = numbers.map((number) => number * number);


const App = () => {
    const [searchTerm, setSearchTerm] = useState('React');
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
            {props.list.map((item) => <Item item={item} key={item.objectID} />)}
        </ul>
    );
}

const Item = (props) => {
    return (
        <li>
            <span><a href={props.item.url}>{props.item.title}</a></span>
            <span>{props.item.author}</span>
            <span>{props.item.num_comments}</span>
            <span>{props.item.points}</span>
        </li>
    );
}

const Search = (props) => {
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" value={props.search} onChange={props.onSearch} />
        </div>
    );
}

export default App;
