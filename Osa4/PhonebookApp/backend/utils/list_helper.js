const dummy = (blogs) => {
    return 1;
  }
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}
  
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    return blogs.reduce((favorite, blog) => blog.likes > favorite.likes ? blog : favorite);
}
  
const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;
  
    // Create an object to count blogs per author
    const authorCounts = {};
  
    // Count the blogs for each author
    blogs.forEach(blog => {
      authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1;
    });
  
    // Find the author with the highest blog count
    const authorWithMostBlogs = Object.keys(authorCounts).reduce((maxAuthor, author) => {
      return authorCounts[author] > authorCounts[maxAuthor] ? author : maxAuthor;
    });
  
    return {
      author: authorWithMostBlogs,
      blogs: authorCounts[authorWithMostBlogs]
    };
};
  
  
const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;
  
    const likeCount = blogs.reduce((count, blog) => {
      count[blog.author] = (count[blog.author] || 0) + blog.likes;
      return count;
    }, {});
  
    const authorWithMostLikes = Object.keys(likeCount).reduce((maxAuthor, author) => {
      return likeCount[author] > likeCount[maxAuthor] ? author : maxAuthor;
    });
  
    return {
      author: authorWithMostLikes,
      likes: likeCount[authorWithMostLikes]
    };
}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  };
  