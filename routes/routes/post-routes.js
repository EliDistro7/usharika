

const express = require('express');
const router = express.Router();
const {
    createPost,
    getCommentsForPost,
    addLikeToPost,
    getNewestPosts,
    getPostById,
    addCommentToPost,
    addViewerToPost,
    addShareToPost,
    getPostsByUser,
    getMostRecentPostsByUser,
    getAllPosts,
    deletePost,
    getNumberOfPostsByUser,
    getTrendingQuestionsOverall,
    getTrendingQuestionsByTag,
    getTrendingQuestionsOverall2
} = require('../controllers/post-controller.js');


// Trending questions routes
router.get('/questions/trending', getTrendingQuestionsOverall2); // Trending across all tags
router.get('/questions/trending/:tag', getTrendingQuestionsByTag);

// Post Routes
router.post('/posts', createPost);
router.put('/:postId/viewer', addViewerToPost);
router.get('/post/:postId/comments', getCommentsForPost);
router.put('/:postId/like', addLikeToPost);
router.put('/:postId/comment', addCommentToPost);
router.put('/:postId/share', addShareToPost);
router.get('/user/:userId/posts', getPostsByUser);


router.get('/user/:userId/profile-posts', getNumberOfPostsByUser);
router.get('/post/:postId', getPostById);
router.get('/posts/recent/:userId', getMostRecentPostsByUser);
router.get('/get-posts', getAllPosts);
router.get('/delete-post', deletePost);
router.get('/posts/newest', getNewestPosts);

module.exports = router;
