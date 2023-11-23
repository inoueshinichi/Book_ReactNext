import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

/* style */
const styles: Readonly<{}> = {
  h1: {
    backgroundColor: 'blue',
    color: 'white',
    fontSize: 24,
    padding: 12,
  },
  form: {
    padding: 12,
    border: '1px solid silver',
    backgroundColor: '#F0F0F0F0',
  },
  right: {
    textAlign: 'right',
  },
};


/* type */
type BBSFormState = {
  name: string;
  body: string;
};


// 書き込みフォームのコンポーネント
class BBSForm extends React.Component {
  private state: BBSFormState;

  constructor(props: Readonly<{}>) {
    super(props);

    // 状態
    this.state = {
      name: '',
      body: '',
    };
  }

  // テキストボックスが変化したときの処理(1)
  nameChanged(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      name: e.target.value
    });
  }

  // テキストボックスが変化したときの処理(2)
  bodyChanged(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      body: e.target.value
    });
  }

  // Webサーバに対して書き込みを投稿する
  async post(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    try {
      const url: string = "/api/write";
      const jsonStr: string = JSON.stringify({
        name: this.state.name,
        body: this.state.body
      });

      const res: Response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, 
        // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: jsonStr, // 本体のデータ型は "Content-Type" ヘッダーと一致させる必要があります
      });


    } catch (err: unknown) {
      if (err) {
        console.error(err);
      }

      this.setState({
        body: ''
      });

      if (this.props.onPost) {
        this.props.onPost();
      }
    }
  } // async post

  render() : React.ReactNode {
    return (
      <div style={ styles.form }>
        名前:<br />
        <input type='text' value={this.state.name} onChange={e => this.nameChanged(e)} />
        <br />
        本文: <br />
        <input type='text' value={this.state.body} size='60' onChange={e => this.bodyChanged(e)} />
        <br />
        <button onClick={(e) => this.post(e)}>発言</button>
      </div>
    )
  }
}

// メインコンポーネント
class BBSApp extends React.Component {
  private state: Readonly<{items: Array<BBSFormState>}>;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      items: []
    };
  }

  // コンポーネントがマウントされたらログを読み込む
  
}