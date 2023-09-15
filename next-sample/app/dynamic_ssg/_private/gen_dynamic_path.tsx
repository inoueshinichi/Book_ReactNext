// e.g. アカウントを引数にしたページテンプレート用モジュール

import React from 'react';

export interface PathParams {
    params: {
        id: string;
    }
};

export interface RetData {
    paths: PathParams[];
    fallback: boolean;
};

export async function getData(): Promise<RetData> {
    const paths: PathParams[] = [
        {
            params: {
                id: '1'
            }
        },
        {
            params: {
                id: '2'
            }
        },
        {
            params: {
                id: '3'
            }
        }
    ];

    return { paths, fallback: false };
}