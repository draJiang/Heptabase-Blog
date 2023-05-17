import React from 'react';

export function Button(props) {

    return <a href="#" onClick={props.onClick} className={props.className + " text-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}>
        {props.children}</a>

}