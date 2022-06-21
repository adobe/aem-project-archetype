import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import AForm from './Form'

window.onload = async () => {
    let div = document.getElementById("form-app");
    if (!div) {
        div = document.createElement("div")
        div.id = "form-app"
        document.body.appendChild(div)
    }
    ReactDOM.render(
        <AForm/>,
        div
    );
};