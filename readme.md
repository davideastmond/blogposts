# Blog Posts API

## About

This project is a RESTful API, which will fetch blog posts (from an underlying API) based on the queries it receieves. The blog posts will be returned in JSON format

- *Example:*
`http://localhost:7575/api/posts?tags=tech&direction=desc`
Returns blog posts tagged with _tech_ sorted in descending order (by id).

- *Example:*
`http://localhost:7575/api/posts?tags=health&sortyBy=likes&direction=asc`
Returns blog posts tagged with _health_ sorted by the like count in ascending order.


- Multiple tags are supported. Separate each tag with a comma.
- Caching has also been implemented. If an identical URI is provided, it will check cache first and send a cached response if necessary, otherwise it will hit the source API

## Requirements / Dependencies

- node.js
- express.js
- body-parser
- axios
- memory-cache
- Postman native app (for testing) [Download here](https://www.getpostman.com)

## Installation
1. Unzip code into folder.
2. Install packages by running `npi i`
3. Install Postman native app (for testing) [Download here](https://www.getpostman.com)

## Start

Use `npm start` to start the server locally.

## Testing

Install the Postman native application for your OS, and click the link below to run tests on the API end points.
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f7a91343f1d18167d41d)

#### Testing includes:

- ensuring a valid response is received
- ensuring sorting is correct
- ensuring there are no duplicate posts in a response