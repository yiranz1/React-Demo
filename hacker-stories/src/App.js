import './App.css';

const welcome = {
    greeting: 'Hello',
    title: 'Yiran',
};

const numbers = [1, 2, 3, 4];
const exponentialNumbers = numbers.map((number) => number * number);
const list = [
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

function App() {
  return (
   <div>
     <h1>{welcome.greeting}, {welcome.title}</h1>
       <Search />
       <div>Exponential Numbers: {JSON.stringify(exponentialNumbers)}</div>
       <List />
   </div>
  );
}

function List() {
    return (
        <ul>
            {list.map((item) => {
                return (
                    <li key={item.objectID}>
                        <span><a href={item.url}>{item.title}</a></span>
                        <span>{item.author}</span>
                        <span>{item.num_comments}</span>
                        <span>{item.points}</span>
                    </li>
                )
            })}
        </ul>
    );
}

function Search() {
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text"/>
        </div>
    );
}

export default App;
