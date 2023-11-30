# Quick Guide

This guide contains code examples on how to use tokens, API and the websocket of the coldwave backend environment.
Each directory within the _examples_ directory is a single example. However, the _token_ directory also contains
some lines of code that demonstrates how to call an API get endpoint.

## Prerequisites

Get a recent [Nodejs](https://nodejs.org/en/) version, preferably v18 or above.

## Installation

To install dependencies, run
````text
npm install
```` 
within the root directory.
## Usage

First, setup all the required config in the _examples/config.ts_ file.

````typescript
export const USER = "";
export const PASSWORD = "";
export const URL = "https://pdev.cbe.coldwave.io/api/v1"; //example URL
export const PATH = "/meta";
export const LOG_API_RESPONSES = false;
export const LOG_WS_MESSAGES = false;
````

For a more verbose output, set the booleans to true. The _URL_ is there as an example. It requires the path up until 
the version as can be seen above. Then run

````text
npm run build
````

to generate the javascript files.

### Tokens

To run the tokens example code simply type

````text
npm run token
````

### Socket

To run the websocket example code run the following command:

````text
npm run socket
````



