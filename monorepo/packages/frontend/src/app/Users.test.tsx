// Mockサーバーを使ったfetch APIの動作テスト

import {
    render,
    screen,
    waitFor,
    fireEvent
} from '@testing-library/react';

import renderer from 'react-test-renderer';


import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import Users from './Users';
import { useUsers } from './Users.hooks';

// jest.mock('useUsers');

// mock server起動
const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('./Users.hooks', () => {
    return {
        useUsers: jest.fn()
    };
});

test('renders Users', () => {
    // // APIのmock
    // server.use(
    //     http.get('/api/users', ({ request, params, cookies }) => {
    //         return HttpResponse.json({ 
    //             users: [
    //                 { name: 'alpha' }, 
    //                 { name: 'beta'}, 
    //                 { name: 'gamma' }
    //             ] 
    //         });
    //     }),
    // );    

    // 外部(下位)モジュール関数のモック化
    const useUsers = jest.fn();
    useUsers.mockImplementation(() => {
        return {
            users: ['alpha', 'beta', 'gamma']
        }
    });
    

    // 描画テストとAPIテストの両方をチェック
    render(<Users />);

    // await waitFor(() => {
    //     return expect(screen.getByText('alpha')).toBeInTheDocument();
    // });

    // await waitFor(() => {
    //     return expect(screen.getByText('beta')).toBeInTheDocument();
    // });

    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
});


test('追加ボタンのsubmitでsubmitとが呼び出される', () => {
    const useUsers = jest.fn();
    const submitMock = jest.fn();
    const updateMock = jest.fn();

    useUsers.mockImplementation(() => {
        return {
            users: ['alpha', 'beta', 'gamma'],
            submit: submitMock,
            update: updateMock,
        }
    });

    render(<Users />);

    fireEvent.submit(screen.getByText('追加')); // React要素<button type='submit'>追加</button>にイベントを紐付ける

    expect(submitMock).toHaveBeenCalledTimes(1);
});


test('Usersコンポーネントのスナップショットテスト', () => {
    const useUsers = jest.fn();
    useUsers.mockImplementation(() => {
        return {
            users: ['alpha', 'beta', 'gamma']
        }
    });

    const component = renderer.create(<Users />);

    const tree = component.toJSON();

    // スナップショットファイルと比較　
    expect(tree).toMatchSnapshot();
});

