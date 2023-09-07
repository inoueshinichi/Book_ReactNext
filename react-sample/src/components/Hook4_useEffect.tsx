// useEffectによる副作用のためのフック. 使用頻度高い
// useEffectは描画後にフックが実行される
// useLayoutEffectは描画前にフックが実行される

import React, { useState, useEffect, useLayoutEffect } from 'react';

// タイマーが呼び出される周期を1秒にする
const UPDATE_CYCLE = 1000;

// localstorageで使用するキー
const KEY_LOCALE = 'KEY_LOCALE';

enum Locale {
    US = 'en-US',
    JP = 'ja-JP',
};

const getLocaleFromString = (text : string) => {
    switch (text) {
        case Locale.US:
            return Locale.US;
        case Locale.JP:
            return Locale.JP;
        default:
            return Locale.US;
    }
}

export const Clock = () => {
    const [timestamp, setTimestamp] = useState(new Date());
    const [locale, setLocale] = useState(Locale.US);

    // タイマーのセットをするための副作用
    useEffect(() => {
        // タイマーのセット
        const timer = setInterval(() => {
            setTimestamp(new Date());
        }, UPDATE_CYCLE);
        
        // クリーンアップ関数を渡し, アンマウント時にタイマーの解除をする
        return () => {
            clearInterval(timer);
        }
        // 初期描画時のみ実行する
    }, []);

    // localstorageから値を読み込むための副作用
    // useEffect(同期的): UI描画直後にチェックして変化があれば実行する.
    // useLayoutEffect(同期的): UI描画直前にチェックして変化があれば実行する. (UIに影響をあたえる変数を扱うため同期的になる)
    /*useEffect*/useLayoutEffect(() => {
        const savedLocale = localStorage.getItem(KEY_LOCALE);
        if (savedLocale !== null) {
            setLocale(getLocaleFromString(savedLocale));
        }
    }, []);

    // localeが変化したときに, localstorageに値を保存するための副作用
    useEffect(() => {
        localStorage.setItem(KEY_LOCALE, locale);
        // 依存配列にlocaleを渡し, localeが変化する度に実行するようにする
    }, [locale]);

    return (
        <div>
            <p>
                <span id="current-time-label">現在時刻</span>
                <span>:{timestamp.toLocaleString(locale)}</span>
                <select
                    value={locale}
                    onChange={(e) => setLocale(getLocaleFromString(e.target.value))}>
                    <option value="en-US">en-US</option>
                    <option value="ja-JP">ja-JP</option>
                </select>
            </p>
        </div>
    )
}