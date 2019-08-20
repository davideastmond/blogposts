/* Helper functions make our code more testable. We can evaluate the query parameters for the get request and ensure they 
  are present and/or valid.
*/

const sampleJSONObject = {
  // This is important for validating keys for the purposes of the sortBy function
  id: 1,
  author: "Rylee Paul",
  authorId: 9,
  likes: 960,
  popularity: 0.13,
  reads: 50361,
  tags: [ "tech", "health" ]
};

module.exports = {
  validateTags: (tagString) => {
    // Checks if a tag query is present
    console.log(tagString);
    if (tagString) {
      return { valid: true, result: tagString.split(',') };
    }
    return { valid: false, reason: "Tags parameter is required" };
  }, 

  validateSortBy: (sortByString) => {
    // The sortByString should be an existing key, otherwise it's invalid
    if (sortByString) {
      sortByString = sortByString.toLowerCase();
      if (sampleJSONObject.hasOwnProperty(sortByString.toLowerCase())) {
        return { valid: true, result: sortByString };
      }
    } else {
      return { valid: false, reason: "sortBy parameter is invalid" };
    }
  },

  validateSortDirection: (sortDirectionString) => {
    if (sortDirectionString) {
      sortDirectionString = sortDirectionString.toLowerCase();
      if (sortDirectionString !== "asc" && sortDirectionString !== "desc") {
        return { valid: false, reason: "sort direction parameter is invalid" };
      } else {
        return { valid: true, result: sortDirectionString };
      }
    } else {
      return { valid: true, result: "asc" };
    }
  }
};