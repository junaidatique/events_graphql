const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const { simpleUser } = require("./common")
const jwt = require('jsonwebtoken');
const axios = require('axios');
const querystring = require('querystring');


module.exports = {
  users: async () => {
    const users = await User.find().populate('createdEvents');
    try {
      return users.map(user => {
        return simpleUser(user)
      })
    } catch (error) {
      throw error;
    }
  },
  fbLogin: async ({ code }) => {
    try {
      // console.log(code);
      var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
      var accessTokenUrl = 'https://graph.facebook.com/v3.2/oauth/access_token';
      var longAccessTokenUrl = 'https://graph.facebook.com/v3.2/oauth/access_token';
      var graphApiUrl = 'https://graph.facebook.com/v3.2/me?fields=' + fields.join(',');
      var paramsAccessToken = {
        code: code,
        client_id: 193676398204768,
        client_secret: "254236059dd79d751f1813c66bb3be61",
        redirect_uri: "https://e8519430.ngrok.io/facebook-callback"
      };
      query = querystring.stringify(paramsAccessToken);
      const accessTokenResponse = await axios.get(`${accessTokenUrl}?${query}`);
      // console.log(accessTokenResponse.data.access_token);
      accessTokenQuery = querystring.stringify({ access_token: accessTokenResponse.data.access_token });
      const userDetailResponse = await axios.get(`${graphApiUrl}&${accessTokenQuery}`);
      console.log(userDetailResponse.data);
      return {
        id: userDetailResponse.data.id,
        email: userDetailResponse.data.email,
        first_name: userDetailResponse.data.first_name,
        last_name: userDetailResponse.data.last_name,
        name: userDetailResponse.data.name
      };
    } catch (error) {
      throw error;
    }

  },
  // fbLogin: async ({ code }) => {
  //   console.log(code);
  //   var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  //   var accessTokenUrl = 'https://graph.facebook.com/v3.2/oauth/access_token';
  //   var longAccessTokenUrl = 'https://graph.facebook.com/v3.2//oauth/access_token';
  //   var graphApiUrl = 'https://graph.facebook.com/v3.2/me?fields=' + fields.join(',');
  //   var paramsAccessToken = {
  //     code: code,
  //     client_id: 193676398204768,
  //     client_secret: "254236059dd79d751f1813c66bb3be61",
  //     redirect_uri: "https://cefa0a80.ngrok.io/facebook-callback"
  //   };

  //   try {
  //     query = querystring(paramsAccessToken);
  //     const response = await axios.get(`${accessTokenUrl}?${query}`);

  //     // const response = await fetch(accessTokenUrl,
  //     //   {
  //     //     method: 'get',
  //     //     body: JSON.stringify(paramsAccessToken),
  //     //     headers: { 'Content-Type': 'application/json' }
  //     //   }
  //     // );
  //     // const json = await response.json();
  //     // console.log(response);
  //     // console.log(json);
  //     // // Step 1. Exchange authorization code for access token.
  //     // const profile = request.get({ url: accessTokenUrl, qs: paramsAccessToken, json: true }, function (err, response, accessToken) {
  //     //   console.log('r1');
  //     //   // console.log(accessToken);
  //     //   if (response.statusCode !== 200) {
  //     //     return response.status(500).send({ message: accessToken.error.message });
  //     //   }

  //     // });

  //     //   const p1 = request.get({ url: graphApiUrl, qs: accessToken, json: true }, function (err, response, profile) {
  //     //     // console.log(profile);
  //     //     // console.log(profile.name);
  //     //     return profile;
  //     //     // return {
  //     //     //   id: profile.id,
  //     //     //   name: profile.name,
  //     //     //   email: profile.email,
  //     //     //   first_name: profile.first_name,
  //     //     //   last_name: profile.last_name
  //     //     // };
  //     //   });
  //     //   console.log('p1');
  //     //   console.log(p1.body);
  //     //   // var paramsLongAccessToken = {
  //     //   //   grant_type: "fb_exchange_token",
  //     //   //   client_id: 193676398204768,
  //     //   //   client_secret: "254236059dd79d751f1813c66bb3be61",
  //     //   //   fb_exchange_token: accessToken.access_token
  //     //   // };
  //     //   // console.log(paramsLongAccessToken);
  //     //   // request.get({ url: longAccessTokenUrl, qs: paramsLongAccessToken, json: true }, function (err, response, longAccessToken) {
  //     //   //   console.log('r2');
  //     //   //   // console.log(response);
  //     //   //   console.log(longAccessToken);
  //     //   //   if (response.statusCode !== 200) {
  //     //   //     // return response.status(500).send({ message: longAccessToken.error.message });
  //     //   //   }


  //     //   // });

  //     // });
  //     // console.log('p2');
  //     // console.log(profile.body);
  //     // return profile;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  createUser: async ({ input }) => {
    try {
      const user = await User.findOne({ email: input.email });
      if (user) {
        throw new Error('User exists already');
      }
      hashedPassword = await bcrypt.hash(input.password, 12);
      const newUser = new User({
        email: input.email,
        password: hashedPassword
      });
      const dbUser = await newUser.save();
      return simpleUser(dbUser);
    } catch (error) {
      throw error;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Email/Password1");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Invalid Email/Password2");
    }
    const token = jwt.sign({ userId: user.id, userEmail: user.email }, 'someSuperSecretKey', {
      expiresIn: '1h'
    })
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }
  }
}