const axios = require('axios');

module.exports = {
	 getData: (arrayOfTags) => {
		return new Promise((masterResolve) => {
			let urls = arrayOfTags.map((element) => {
				return `https://hatchways.io/api/assessment/blog/posts?tag=${element}`;
			});
			
			let postPromiseData = getPromisesArray(urls);
		
			// Complete all the axios get requests, and when complete, resolve everything, returning an array of posts
			Promise.all(postPromiseData.promises)
			.then(() => {
	
				// This should filter out duplicate posts by post id (from: https://dev.to/vuevixens/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep )
				let uniquePosts = Array.from(new Set(postPromiseData.posts.map(a => a.id )))
				.map(id => {
					return postPromiseData.posts.find(a => a.id === id);
				});
				masterResolve(uniquePosts);
			});
		});
	},
	
	 
};
const getPromisesArray = (urls) =>{
	// This is going to return an object - first element a promise arrray, second an array of posts
	let returnPosts = [];
	let promises = urls.map((eachURL) => {
		return new Promise((resolve) => {
			axios.get(eachURL)
			.then((result) => {
				resolve(result.data.posts);

				// Clean up the post data and store it in an array
				result.data.posts.forEach((p) => {
					returnPosts.push(p);
				});
			});
		});
	});

	// Need to sort
	return { promises: promises, posts: returnPosts };
};