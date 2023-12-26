import {
    renderHook,
    waitFor
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { useUsers } from './Users.hooks';

// Browser APIを扱うテストでは, Mockサーバが必要となる
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('users配列がAPIから取得される', async () => {
    // APIのMock
    server.use(
        http.get('/api/users', ({ request, params, cookies }) => {
            HttpResponse.json(({
                users: [{ name: 'alpha' }, { name: 'beta' }, { name: 'gamma' }]
            }));
        })
    );

     // CustomHookの実装結果にアクセスする(ReactHookのモック関数でない)
     const { result } = renderHook(() => useUsers());
     
 // APIのコール終了までま受ける(Browser APIを使った, 副作用を担当するCumstomHook
    await waitFor(() => {
        return expect(result.current.users).toStrictEqual(['alpha', 'beta', 'gamm']);
    });
});