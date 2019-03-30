import React, { Component } from 'react';
import PropTypes from "prop-types";


class OauthButton extends Component {
  static defaultProps = {
    disabled: false,
    dialogWidth: 600,
    dialogHeight: 600,
    customHeaders: {},
    forceLogin: false,
    codeParam: "code"
  };
  constructor(props) {
    super(props);
    this.createPopup = this.createPopup.bind(this);
  }

  createPopup(e) {
    e.preventDefault();
    const popup = this.openPopup();
    if (this.props.requestTokenUrl) {
      return window
        .fetch(this.props.requestTokenUrl, {
          method: "POST",
          credentials: this.props.credentials,
          headers: this.getHeaders()
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          let authenticationUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${
            data.oauth_token
            }&force_login=${this.props.forceLogin}`;

          if (this.props.screenName) {
            authenticationUrl = `${authenticationUrl}&screen_name=${
              this.props.screenName
              }`;
          }

          popup.location = authenticationUrl;
          this.polling(popup);
        })
        .catch(error => {
          popup.close();
          return this.props.onFailure(error);
        });
    } else {
      try {
        popup.location = `${this.props.oauthUrl}`;
        this.polling(popup);
      } catch (error) {
        popup.close();
        return this.props.onFailure(error);
      }
    }
  }

  polling(popup) {
    const polling = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(polling);
        this.props.onFailure(new Error("Popup has been closed by user"));
      }

      const closeDialog = () => {
        clearInterval(polling);
        popup.close();
      };

      try {
        console.log('pop up location');
        console.log(popup.location);
        console.log(popup.location.search);
        if (popup.location.search) {
          const query = new URLSearchParams(popup.location.search);
          const code = query.get(this.props.codeParam);
          if (!code) {
            return;
          }
          console.log(query);
          this.props.onSuccess(code);
          closeDialog();
          return query;
        } else {
          // closeDialog();
          // return this.props.onFailure(
          //   new Error(
          //     "OAuth redirect has occurred but no query or hash parameters were found. " +
          //     "They were either not set during the redirect, or were removed—typically by a " +
          //     "routing library—before Twitter react component could read it."
          //   )
          // );
        }
      } catch (error) {
        console.log(error);
        // closeDialog();
        // return this.props.onFailure(
        //   new Error(
        //     "Some error"

        //   )
        // );
      }
    }, 500);
  }

  openPopup() {
    const width = this.props.dialogWidth;
    const height = this.props.dialogHeight;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    return window.open(
      "",
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      width +
      ", height=" +
      height +
      ", top=" +
      top +
      ", left=" +
      left
    );
  }

  render() {
    return <button onClick={this.createPopup}>
      {this.props.text ? this.props.text : 'Click 1'}
    </button>;
  }
}

OauthButton.propTypes = {
  text: PropTypes.string,
  oauthUrl: PropTypes.string.isRequired,
  codeParam: PropTypes.string.isRequired,
  requestTokenUrl: PropTypes.string,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  dialogWidth: PropTypes.number,
  dialogHeight: PropTypes.number,
  showIcon: PropTypes.bool,
  credentials: PropTypes.oneOf(["omit", "same-origin", "include"]),
  customHeaders: PropTypes.object,
  forceLogin: PropTypes.bool,
  screenName: PropTypes.string
};


export default OauthButton;