import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import AForm from './Form'

const base64url = (s: any) => {
    var to64url = btoa(s);
    // Replace non-url compatible chars with base64url standard chars and remove leading =
    return to64url.replace(/\+/g, '_').replace(/\//g, '-').replace(/=+${symbol_dollar}/g, '');
}


const getId = () => {
    let id =  ""
    if (!process.env.FORMPATH) {
        const parent = document.querySelector(".cmp-formcontainer")
        id = parent.getAttribute("data-form-id")
    } else {
        id = base64url(process.env.FORMPATH)
    }
    return id;
}


window.onload = async () => {
    let div = document.getElementById("form-app");
    if (!div) {
        div = document.createElement("div")
        div.id = "form-app"
        document.body.appendChild(div)
    }
    ReactDOM.render(
        <AForm id={getId()}/>,
        div
    );
};