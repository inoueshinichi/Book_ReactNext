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
const styles: Readonly<any> = {
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
  msg: string;
};

type BBSFormProps = {
  serverDomain: string;
  serverPort: number;
  onPost?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};


// 書き込みフォームのコンポーネント
class BBSForm extends React.Component<BBSFormProps, BBSFormState> {
 
  constructor(props: Readonly<BBSFormProps>) {
    super(props);

    // 状態
    this.state = {
      name: '',
      msg: '',
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
      msg: e.target.value
    });
  }

  // Webサーバに対して書き込みを投稿する
  post(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    try {
      const serverOrigin: string = `http://${this.props.serverDomain}:${this.props.serverPort}`;
      let url: string = serverOrigin + "/api/write";
      url += `?name=${this.state.name}&msg=${this.state.msg}`; // query

      // fetch関数は, Promiseもしくは無名関数でasyncを包む方法が良さそう.
      (async function () {
        console.log("これからサーバDBに書き込みます");
        
        // サーバにアクセスしてDBに書き込む
        await fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, 
          // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        })
        // 23/11/23
        // ここから以降が処理されない....
        .then((res: Response) => {
          console.log(res);
          console.log('fetch関数後の処理って実行される？');

          if (res.ok) {
            console.log('サーバDBに書き込みました');
          } else {
            console.log('サーバDBに書き込み失敗');
          }
          return res.text();
        })
        .catch((err: unknown) => {
          console.error(err);
        });

        console.log("fetch後が処理されません");
        
      })();

/*
      const resPro: Promise<Response> = fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, 
        // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      });

      resPro.then((res: Response) => {
        if (res.ok) {
          console.log("サーバDBに書き込めた");
        } else {
          console.log("サーバdBに書き込み失敗");
        }
      })
      .catch((err: Error) => {
        if (err) {
          console.error(err);
        }
      });
*/

    } catch (err: unknown) {
      if (err) {
        console.error(err);
      }
    } // catch

    // メッセージは空欄
    this.setState({
      msg: ''
    });

    // UIの更新
    // 再度サーバーにアクセスしてDBデータを取得する
    if (this.props.onPost !== undefined) {
      console.log('React側でpostを実行');
      this.props.onPost(e);
    }  

    console.log('this.postを実行した');
  } // post

  render() : JSX.Element {
    return (
      <div style={ styles.form }>
        名前:<br />
        <input type='text' value={this.state.name} onChange={e => this.nameChanged(e)} />
        <br />
        本文: <br />
        <input type='text' value={this.state.msg} size={60} onChange={e => this.bodyChanged(e)} />
        <br />
        <button onClick={e => this.post(e)}>発言</button>
      </div>
    )
  }
}

type BBSAppState = {
  items: Array<{ timestamp: string, comment: { name: string; msg: string; }}>;
};

// メインコンポーネント
class BBSApp extends React.Component<{}, BBSAppState> {
  // public state: Readonly<BBSAppState>;
  private serverDomain: string;
  private serverPort: number;
  private serverOrigin: string;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      items: [] // 掲示板の各コメント
    };

    this.serverDomain = "localhost"
    this.serverPort = 4000;
    this.serverOrigin = `http://${this.serverDomain}:${this.serverPort}`
  }

  // コンポーネントがマウントされたらログを読み込む
  componentWillUnmount(): void {
      this.loadLogs();
  }

  // APIにアクセスして掲示板のログ一覧を取得
  loadLogs(): void {

    const url: string = this.serverOrigin + "/api/getItems";
    const res: Promise<Response> = fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      },
    });

    res.then((res: Response) => {
      // res.body is json : "logs": [Array<{ timestamp: 'time', comment : { name: 'name', msg: 'msg' }}}>]
      
      // ブラウザ側でチェック
      // console.log(res);

      if (res.ok) {
        return res.json();
      }
      throw new Error('指定のリソースが無効です');
    })
    .then(jsonData => {
      // ブラウザ側でチェック
      console.log(jsonData);

      // 再描画
      this.setState({
        items: jsonData.logs
      });

      console.log('fetch then in loadLogs');

    }).catch((err: unknown) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  } // loadLogs

  render(): JSX.Element {
    // 発言ログの一つずつを生成する
    const itemsHtml: JSX.Element[] = this.state.items.map(e => {
      return <li key={e.timestamp}>{e.comment.name} - {e.comment.msg}</li>;
    });

    return (
      <div>
        <h1 style={ styles.h1 }>掲示板</h1>
        <BBSForm serverDomain={this.serverDomain} 
                 serverPort={this.serverPort} 
                 onPost={e => this.loadLogs()} />
        <p style={ styles.right }>
          <button onClick={e => this.loadLogs()}>再読込</button>
        </p>
        <ul>{itemsHtml}</ul>
      </div>
    );
  }
}

export default BBSApp;