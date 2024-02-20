
/* 3rd */
import React, {
    useContext,
    useState,
    useLayoutEffect,
    useEffect,
    useMemo,
    memo,
    useCallback,
    useRef,
    useReducer
} from 'react';

import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate
} from 'react-router-dom'

/* self */

// 定数
const numRows: number = 28;
const numCols: number = 28;
const numPixels: number = numRows * numCols;
const sizeRow: number = 10;
const sizeCol: number = 10;

// 画像配列のクリア
function clearPixels(pixel: Uint8Array) {
    pixel.fill(0);
}

// 画像配列に描画
function drawCanvas(ctx2D: any, pixels: Uint8Array) {
    // クリア
    ctx2D.clearRect(0, 0, 280, 280);

    // 補助線を描画
    ctx2D.strokeStyle = 'silver';
    ctx2D.moveTo(140, 0); ctx2D.lineTo(140, 280); // 縦線
    ctx2D.moveTo(0, 140); ctx2D.lineTo(280, 140); // 横線
    ctx2D.stroke();

    // ドットを描画
    ctx2D.fillStyle = 'blue';
    for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
            const p = pixels[y * numRows + x];
            if (p === 0) continue;
            const xx = x * sizeCol;
            const yy = y * sizeRow;
            ctx2D.fillRect(xx, yy, sizeCol, sizeRow);
        }
    }
}

function predictLabel(pixels: Uint8Array): string {
    // const px: string = pixels.map(v: Uint8 => v.toString(16)).join('');
    // return px;
    let num = Math.floor(Math.random() * 10) + 1;
    return num.toString();
    // return 'Label';
}

function TegakiDraw() {

    // 状態
    const [canvasElem, setCanvasElem] = useState<HTMLCanvasElement | null>(null);
    const [ctx2D, setCtx2D] = useState<CanvasRenderingContext2D | null> (null);
    const [isDown, setIsDown] = useState<boolean>(false);
    const [pixels, setPixels] = useState<Uint8Array>(new Uint8Array(numPixels));
    const [label, setLabel] = useState<string>('');

    // ハンドラ
    const doMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        setIsDown(true);
    };

    const doMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        setIsDown(false);
        setLabel(predictLabel(pixels));
    };

    const doMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDown) return;
        const ne: MouseEvent = e.nativeEvent;

        // <canvas>要素が存在するクライアント領域を取得
        const bcr: DOMRect = /*HTMLCanvasElement*/canvasElem!.getBoundingClientRect();

        // 相対座標の計算
        const rx: number = ne.clientX - bcr.left;
        const ry: number = ne.clientY - bcr.top;

        const x: number = Math.floor(rx / sizeCol);
        const y: number = Math.floor(ry / sizeRow);

        pixels[y * numRows + x] = 0x0F; // 灰色
        setPixels(pixels);
    };

    useLayoutEffect(() => {
        // レンダリング前

        // 初期化
        clearPixels(pixels); 

        return (() => { clearPixels(pixels); });
    }, []); // 初回のみ

    useEffect(() => {
        // レンダリング後
        drawCanvas(ctx2D, pixels);
    }, [pixels]);

    return (
        <React.Fragment>
            <div className="canvas-area">
                <canvas ref={(e: HTMLCanvasElement) => { setCanvasElem(e); }}
                    width={280} height={280}
                    onMouseDown={ (e: React.MouseEvent<HTMLCanvasElement>) => { doMouseDown(e); } }
                    onMouseUp={ (e: React.MouseEvent<HTMLCanvasElement>) => { doMouseUp(e); } }
                    onMouseMove={ (e: React.MouseEvent<HTMLCanvasElement>) => { doMouseMove(e); } }
                    onMouseOut={ (e: React.MouseEvent<HTMLCanvasElement>) => { doMouseUp(e); } }
                />
                <p>予測: {label}</p>
                <button 
                    onClick= { (e: React.MouseEvent<HTMLButtonElement>) => { clearPixels(pixels); }}>
                        クリア
                    </button>
            </div>
        </React.Fragment>
    );
}

export default TegakiDraw;