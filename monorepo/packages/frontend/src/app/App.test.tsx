// Appのテスト
import {
    render,
    screen,
    waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom';


import App from './App';

// test('renders learn react link', () => {
test('render Monorepo link', () => {
    render(<App />);
    // const linkElement = screen.getByText(/learn react/i);
    const linkElement = screen.getByText(/Monorepo/i);
    expect(linkElement).toBeInTheDocument();
});

import Users from './Users';

test('renders Users', async () => {
    render(<Users />);

    await waitFor(() => {
        return expect(screen.getByText('alpha')).toBeInTheDocument();
    });
});