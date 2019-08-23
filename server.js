const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 7575;
const dataHelpers = require('./data-helpers');
const cache = require('memory-cache');

// Modules
const helpers = require('./helpers.js');

// Middle-ware
app.use(bodyParser.urlencoded( {extended: false}));
app.use(express.urlencoded());

// Routes
app.get("/api/ping", (req, res) => {
  // As per requirements, api/ping route response
  res.status(200).send({ success: true });
});

app.get("/api/posts", (req, res) => {
  /* We have three query parameters needed to complete a successful API request 
    tags: subjects to query
    sortBy: field to sort
    direction: ascending or descending
  */

  /* Grab the info from the queryStrings and store them in variables. 
  Tags need to be stored in an array. We'll use split() to split them with a comma delimiter
  */
  
  const sortBy = req.query.sortBy;
  const direction = req.query.direction;

  // Validate query input by calling the helper functions. They will return an appropriate HTTP response depending on the result
  const validationTagsResult = helpers.validateTags(req.query.tags);
  const validationSortByResult = helpers.validateSortBy(sortBy);
  const validationSortDirection = helpers.validateSortDirection(direction);

  if (!validationTagsResult.valid) {
    res.status(400).send({ error: validationTagsResult.reason });
    return;
  }

  if (!validationSortByResult.valid) {
    res.status(400).send({ error: validationSortByResult.reason });
    return;
  }

  if (!validationSortDirection.valid) {
    res.status(400).send( { error: validationSortDirection.reason });
    return;
  }

  // Check if the query is cached -- if not, hit the API. If so, return the cached data (sorted if necessary)
  let cachedData = cache.get(req.originalUrl);

  if (cachedData) {
    
    if (sortBy || direction) {
      const sortedValues = dataHelpers.sortResponseData(cachedData, sortBy, direction);
      res.status(200).send({ success: 'ok', posts: sortedValues, cachedResponse: 'true', sortInfo: {sorted: true, sortBy: sortBy, direction: direction }});
    } else {
      res.status(200).send({ success: 'ok', posts: cachedData, cachedResponse: 'true' });
    }

  } else {
    dataHelpers.getData(validationTagsResult.result).then((responseData) => {
      // Sort the response only if we have a sortBy or direction query parameter
      if (sortBy || direction) {
        // If any of these query parameters are present, perform a sort by calling a function from our dataHelpers
        
        const sortedValues = dataHelpers.sortResponseData(responseData, sortBy, direction);
        res.status(200).send({ success: 'ok', posts: sortedValues, sortInfo: {sorted: true, sortBy: sortBy, direction: direction } });
      } else {
        res.status(200).send({ success: 'ok', posts: responseData });
      }
      
      // Store the response in the cache
      cache.put(req.originalUrl, responseData);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({error: error});
    });
  }
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

