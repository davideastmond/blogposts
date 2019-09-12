const axios = require('axios');
require('dotenv').config();

module.exports = {
  // This module hits the hatchways api and gets the data concurrently. It also removes duplicates
  getData: (arrayOfTags) => {
    return new Promise((masterResolve) => {
      // Convert each query into a correctly composed API end point and put each URI into an array
      let urls = arrayOfTags.map((element) => {
				return process.env.HATCHWAYS_URI.concat(element);
      });
      
      // Make the urls into an array of promises
      let postPromiseData = getPromisesArray(urls);
    
      // Complete all the axios get requests concurrently, and when complete, resolve everything, returning an array of posts
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
  
  sortResponseData: (arrayData, sortByProperty = "id", dir = "asc") => {
    // Function will return a sorted array
    if (dir === "asc") {
      return arrayData.sort((a, b) => {
        if (a[sortByProperty] < b[sortByProperty]) {
          return -1;
        } else if (a[sortByProperty] > b[sortByProperty]) {
          return 1;
        }
        return 0;
      });
    } else if (dir === "desc") {
      return arrayData.sort((a, b) => {
        if (a[sortByProperty] < b[sortByProperty]) {
          return 1;
        } else if (a[sortByProperty] > b[sortByProperty]) {
          return -1;
        } 
        return 0;
      });
    }
  }
};

const getPromisesArray = (urls) =>{
  // This is going to return an object - first element a promise array, second an array of posts
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

  return { promises: promises, posts: returnPosts };
};