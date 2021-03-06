import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import './Auth.css';

class AuthPage extends Component {
  state = {
    isLogin: true
  }

  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }
  swithModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    })
  }
  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    }
    if (!this.state.isLogin) {
      requestBody = {
        query: `
        mutation {
          createUser(input: {
            email: "${email}",
            password: "${password}"
          }) 
          {
            _id
            email
          }
        }
      `
      }
    }

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => {
      console.log(response);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      return response.json();
    }).then(resData => {
      if (resData.data.login.token) {
        this.context.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        );
      }
    }).catch(error => {
      console.log(error);
    });
    // console.log(response);
  };
  render() {
    return <form className="authForm" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E mail</label>
        <input type="email" id="email" ref={this.emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={this.passwordEl} />
      </div>
      <div className="form-action">
        <button type="submit">Submit</button>
        <button type="button" onClick={this.swithModeHandler}>Switch to {this.state.isLogin ? 'Signup' : "Login"}</button>
      </div>
    </form>;
  }
}
export default AuthPage;