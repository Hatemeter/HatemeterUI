import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import $ from "jquery";


//window.HateMeterApiUrlPrefix = "http://localhost:8080/HateMeter/"
//window.HateMeterApiUrlPrefix = ""

$.ajax({
    type : "POST",
    crossDomain: true,
    url : window.HateMeterApiUrlPrefix + "userDetails",
    data: JSON.stringify(""),
    dataType: "json",
    async: false,
    success: function (response) {
        if (response.privacy === null){
            window.location.replace("privacy.html");
        }else{

            ReactDOM.render(<App />, document.getElementById('root'));

        }
    },
    error: function (xhr, status) {
        //alert("error");
    }
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
