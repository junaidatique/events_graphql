const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const gqlSchema = require('./graphql/schema/index')
const gqlresolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')
const app = express();


app.use(bodyParser.json());
app.use(isAuth);
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Autherization');
  if (request.method === 'OPTIONS') {
    return response.sendStatus(200);
  }
  next();
});
app.use('/graphql',
  graphqlHttp(
    {
      schema: gqlSchema,
      rootValue: gqlresolvers,
      graphiql: true
    }
  )
)
mongoose.connect('mongodb://localhost/graphQL_events')
  .then(() => {
    app.listen(8080);
  })
  .catch(error => {
    console.log(error);
  })
