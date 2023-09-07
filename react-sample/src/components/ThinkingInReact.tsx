// Reactによるコンポーネント指向UI設計の例題
import React, { useState, useReducer, useCallback, useMemo, memo, useContext, useEffect, useRef, useImperativeHandle } from 'react';

// JSON object
const PRODUCTS = [
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
];

const SearchBar = (): JSX.Element => {
    return (
        <form>
            <input type="text" placeholder="Search..." />
            <label>
                <input type="checkbox" />
                {' '}
                Only show products in stock
            </label>
        </form>
    );
}

type Product = {
    category: string;
    price: string;
    stocked: boolean;
    name: string;
};

const ProductCategoryRow = (props: {category: string, key: string}): JSX.Element => {
    const {category, key} = props;
    return (
        <tr>
            <th colSpan={2}>
                {category}
            </th>
        </tr>
    );
}

const ProductRow = (props: { product: Product, key: string }): JSX.Element => {
    const { product, key } = props;
    const name: string | JSX.Element = product.stocked ? 
        product.name : <span style={ {color:'red'} }>{product.name}</span>;

    return (
        <tr>
            <td>{name}</td>
            <td>{product.price}</td>
        </tr>
    );
}

const ProductTable = (props: {products: Array<Product>}): JSX.Element => {
    const { products } = props;
    const rows: Array<JSX.Element> = [];
    let lastCategory = null;

    products.forEach((product) => {
        if (product.category !== null) {
            rows.push(
                <ProductCategoryRow category={product.category} key={product.category} />
            );
        }
        rows.push(
            <ProductRow product={product} key={product.name} />
        );
        lastCategory = product.category;
    });

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}

const FilterableProductTable = (props: { products: Array<Product> }): JSX.Element => {
    const { products } = props;
    return (
        <div>
            <SearchBar />
            <ProductTable products={products} />
        </div>
    );
}

export const ThinkingInReactApp = () => {
    return (
        <FilterableProductTable products={PRODUCTS} />
    );
}