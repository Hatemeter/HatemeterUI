import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import $ from "jquery";
// Containers
import { DefaultLayout } from './containers';
// Pages

// import { renderRoutes } from 'react-router-config';
const axios = require('axios');



class App extends Component {

  constructor(props){
    super(props);
    $.ajax({
      type : "POST",
      crossDomain: true,
      url : window.HateMeterApiUrlPrefix + "userDetails",
      data: JSON.stringify(""),
      dataType: "json",
      async: false,
      success: function (response) {
        sessionStorage.setItem('user_details', JSON.stringify(response));
      },
      error: function (xhr, status) {
        //alert("error");
      }
    });

    //
    // const instance = axios.create();
    // instance.defaults.timeout = 3000;
    // instance.post('http://localhost:8080/HateMeter/userDetails', {
    //
    // }).then(function (response) {
    //   if (!response.data.hasOwnProperty("token")) {
    //     //return event.returnValue = response.data;
    //   } else {
    //
    //   }
    // });
  }


  render() {
    return (
      <HashRouter>
        <Switch>
          {/*<Route exact path="/login" name="Login Page" component={Login} />*/}
          {/*<Route exact path="/register" name="Register Page" component={Register} />*/}
          {/*<Route exact path="/404" name="Page 404" component={Page404} />*/}
          {/*<Route exact path="/500" name="Page 500" component={Page500} />*/}
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
