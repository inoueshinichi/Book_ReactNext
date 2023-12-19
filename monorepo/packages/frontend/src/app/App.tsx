// Scaffold of App

function App() {
    const users = [
        'alpha', 'beta', 'gamma', 'delta'
    ];


    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>

            <div className="App-body">
                <ul>
                    {users.map((user) => {
                        return <li key={user}>{user}</li>
                    })}
                </ul>
                <form>
                    <input type="text" />
                    <button type="submit">追加</button>
                </form>
            </div>
        </div>
    );
}

export default App;