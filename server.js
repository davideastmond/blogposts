const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 7575;
const axios = require('axios');
const dataHelpers = require('./data-helpers');

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

	const tags = req.query.tags;
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

	dataHelpers.getData(validationTagsResult.result).then((responseData) => {
		//console.log(responseData);
		res.status(200).send({ success: 'got posts', posts: responseData });
	})
	.catch((error) => {
		res.status(400).send({error: error});
	});
});

// Server listening
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

