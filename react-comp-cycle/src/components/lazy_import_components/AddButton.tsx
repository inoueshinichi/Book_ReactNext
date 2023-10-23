import React, { useState, useMemo, memo, useCallback } from "react";

const AddButton = ({ disabled, onClick }) => {
    console.log('render <AddButton />');

    return (
        <p>
            <button disabled={disabled} onClick={onClick}>
                カートに追加する
            </button>
        </p>
    );
};

export default AddButton;