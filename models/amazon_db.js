var mysql = require('mysql');

// secret.json file is required for Amazon RDS to work
var config = require('./json/secret.json');

// Creates the connection to the database
var pool  = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname,
  port: config.port
});

/**
 * Loads all threads from the database
 */
var loadThreads = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(`SELECT * FROM monster_hunter_forum_DB.Threads;`, (error, results, fields) => {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) reject(error);
        else resolve(results);
      });
    });
  });
}

/**
 * Loads all posts from the database
 * Query can be adjusted to select posts for a specific thread
 */
var loadPosts = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(`SELECT * FROM monster_hunter_forum_DB.Posts;`, (error, results, fields) => {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) reject(error);
        else resolve(results);
      });
    });
  });
}

/**
 * Creates a new thread and appends to the database
 * @param {number} thread_id - A unique thread ID
 * @param {string} thread_title - The title for the thread
 * @param {number} views - Number of times a thread has been clicked
 */
var createThread = (thread_id, thread_title, views, link) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(`INSERT INTO Threads (thread_id, thread_title, views)
      VALUES('${thread_id}', '${thread_title}', '${views}');`, (error, results, fields) => {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) reject(error);
        else resolve(results);
      });
    });
  });
}

/**
 * Creates a post and appends to the database
 * @param {number} post_id - A post ID unique for each thread
 * @param {number} thread_id - A unique ID for each thread
 * @param {string} username - A unique username for each user
 * @param {string} datetime - The posts' date and time
 * @param {string} post - The contents of the post
 */
var createPost = (post_id, thread_id, username, datetime, post) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(`INSERT INTO Posts (thread_id_fk, post_id, username, post_date, post) 
      VALUES('${thread_id}', '${post_id}', '${username}', '${datetime}', '${post}');`, (error, results, fields) => {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) reject(error);
        else resolve(results);
      });
    });
  });
}

/**
 * Increments the most recent thread number for use
 * in the next new thread.
 */
var getNextThreadID = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(`SELECT thread_id FROM monster_hunter_forum_DB.Threads ORDER BY thread_id DESC LIMIT 1;`, (error, results, fields) => {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) reject(error);
        else resolve(results[0].thread_id + 1);
      });
    });
  });
}

/**
 * Thread ID to be used to determine which thread will be posted in
 * @param {number} thread_id - The unique thread number
 */
var getNextPostID = (thread_id) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(`SELECT post_id FROM monster_hunter_forum_DB.Posts WHERE thread_id_fk = ${thread_id} ORDER BY post_id DESC LIMIT 1;`, (error, results, fields) => {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) reject(error);
        else resolve(results[0].post_id + 1);
      });
    });
  });
}

var loadUsers = (username, password) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(`SELECT * FROM Users where username = '${username}' and password = '${password}';`, (error, results, fields) => {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) reject(error);
        else resolve(results);
      });
    });
  });
}


module.exports = {
  loadThreads,
  loadPosts,
  createThread,
  createPost,
  getNextThreadID,
  getNextPostID,
  loadUsers
}