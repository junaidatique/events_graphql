import React, { Component } from 'react';
import OauthButton from './Oauth';


class SocialLogins extends Component {
  constructor(props) {
    super(props);
    this.onFailed = this.onFailed.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }
  onSuccess(response) {
    console.log(response);

    let requestBody = {
      query: `
        query {
          fbLogin(code: "${response}") {  
            id        
            email
            first_name
            name
          }
        }
      `
    }
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => {
      console.log('r1');
      console.log(response);
      return response.json();
    }).then(resData => {
      console.log('r2');
      console.log(resData);
    }).catch(error => {
      console.log(error);
    });
  }

  onFailed(error) {
    alert(error);
  }



  render() {
    const fbLoginURL = "https://www.facebook.com/v3.2/dialog/oauth?client_id=193676398204768&redirect_uri=https://e8519430.ngrok.io/facebook-callback&state=1234&response_type=code,granted_scopes&scope=email"
    return (
      <div>
        <OauthButton
          oauthUrl={fbLoginURL}
          onFailure={this.onFailed}
          onSuccess={this.onSuccess}
          text="Login with Facebook"
        />
      </div>
    );
  }
}

SocialLogins.propTypes = {

};

export default SocialLogins;