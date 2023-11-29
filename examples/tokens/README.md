# Tokens

This directory contains an example on how to get and use tokens, as well as refresh tokens. The code aims to keep the
user signed in at all times. Meaning, that we try to generate a token from the credentials in combination with a refresh
token. Should the token time out, we try to get a new token from the refresh token and keep the user logged in. This
example uses the fetch API. Within this code we create a TokenHandler class. The TokenHandler class will be used to
provide a valid token to API and websocket requests in other examples.