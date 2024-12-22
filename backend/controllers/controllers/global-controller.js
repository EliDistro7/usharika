

const GlobalState = require('../models/globalStateSchema.js'); // Adjust the path to your model as necessary
const Post = require('../models/postSchema.js');


// Initialize the global state if it doesn't exist
const initializeGlobalState = async () => {
    try {
        const existingState = await GlobalState.findOne();
        if (!existingState) {
            const defaultState = new GlobalState({
                trendingTopics: [],
                siteAnnouncements: [],
                systemMetrics: {
                    totalUsers: 0,
                    totalPosts: 0,
                    activeUsers: [],
                    totalUsersToday: 0,
                    postsToday: 0
                },
            });
            await defaultState.save();
          //  console.log('Global state initialized with default values.', existingState);
        } else {
            console.log('Global state already initialized.'

            );
        }
    } catch (error) {
        console.error('Failed to initialize global state:', error);
    }
};

// Get all active users
const getActiveUsers = async (req, res) => {
    try {
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }
        res.status(200).json(globalState.systemMetrics.activeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve active users', error });
    }
};

// Add an active user
const addActiveUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }

        if (!globalState.systemMetrics.activeUsers.includes(userId)) {
            globalState.systemMetrics.activeUsers.push(userId);
            await globalState.save();
        }
        res.status(201).json(globalState.systemMetrics.activeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add active user', error });
    }
};

// Get total users today
const getTotalUsersToday = async (req, res) => {
    try {
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }
        res.status(200).json(globalState.systemMetrics.totalUsersToday);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve total users today', error });
    }
};

// Update total users today
const updateTotalUsersToday = async (req, res) => {
    try {
        const { totalUsersToday } = req.body;
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }

        globalState.systemMetrics.totalUsersToday = totalUsersToday;
        await globalState.save();
        res.status(200).json(globalState.systemMetrics.totalUsersToday);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update total users today', error });
    }
};

// Update other system metrics (totalUsers, totalPosts, postsToday)
const updateSystemMetrics = async (req, res) => {
    try {
        const { totalUsers, totalPosts, postsToday } = req.body;
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }

        if (totalUsers !== undefined) globalState.systemMetrics.totalUsers = totalUsers;
        if (totalPosts !== undefined) globalState.systemMetrics.totalPosts = totalPosts;
        if (postsToday !== undefined) globalState.systemMetrics.postsToday = postsToday;

        await globalState.save();
        res.status(200).json(globalState.systemMetrics);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update system metrics', error });
    }
};

const getTrendingTopics = async (req, res) => {
    const { page = 1, limit = 3, postType } = req.query;
    const skip = (page - 1) * limit;

    try {
        console.log('Getting post data from database');

        const posts = await Post.find({ tags: postType })
            .populate('author')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        // Calculate the trending score for each post
        const trendingPosts = posts.map(post => {
            const totalLikes = post.likes.length || 0;
            const totalComments = post.comments?.length || 0;
            const totalShares = post.shares || 0;
            const totalViews = post.viewers.length || 0;
            const totalReactions = totalLikes + totalComments + totalShares + totalViews;

            // Calculate the time elapsed since the post was created in hours
            const timeElapsedInHours = (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60);

            // Calculate the trending score without recency
            const trendingScore = totalReactions / (timeElapsedInHours + 1); // Avoid division by zero

            // Dynamic recency adjustment
            let recencyScore = -timeElapsedInHours * 0.5; // Linear decay; adjust factor as needed

            // Introduce a threshold for negative impact
            if (timeElapsedInHours > 48) { // For posts older than 2 days
                recencyScore -= (timeElapsedInHours - 48) * 0.1; // Further penalize for every hour beyond 48
            }

            // Ensure recencyScore does not drop below a certain value
            recencyScore = Math.max(recencyScore, -trendingScore); // Prevent recencyScore from exceeding trendingScore

            return {
                ...post.toObject(),
                trendingScore: trendingScore + recencyScore,
                boostMultiplier: post.boosted ? 2 : 1,
            };
        });

        // Sort by total trending score
        trendingPosts.sort((a, b) => (b.trendingScore * b.boostMultiplier) - (a.trendingScore * a.boostMultiplier));

        // Return posts along with pagination info
        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(await Post.countDocuments({ tags: postType }) / limit),
            posts: trendingPosts,
        });
    } catch (error) {
        console.error('Error fetching trending topics:', error);
        res.status(500).json({ message: 'Failed to retrieve trending topics', error: error.message });
    }
};


const getTrendingTopics2 = async (req, res) => {
    const { page = 1, limit = 3 } = req.query; // Changed the limit to 3 posts per request
    const skip = (page - 1) * limit;

    try {
        console.log('Getting post data from database');

        // Fetch all posts without filtering by tags
        const posts = await Post.find()
            .populate('author')
            .sort({ createdAt: -1 }) // Sort by creation date
            .skip(skip)
            .limit(Number(limit));

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        // Calculate the trending score for each post
        const trendingPosts = posts.map(post => {
            const totalLikes = post.likes.length || 0;
            const totalComments = post.comments?.length || 0;
            const totalShares = post.shares || 0;
            const totalViews = post.viewers.length || 0;
            const totalReactions = totalLikes + totalComments + totalShares + totalViews;

            // Calculate the time elapsed since the post was created in hours
            const timeElapsedInHours = (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60);

            // Calculate the trending score without recency
            const trendingScore = totalReactions / (timeElapsedInHours + 1); // Avoid division by zero

            // Dynamic recency adjustment
            let recencyScore = -timeElapsedInHours * 0.5; // Linear decay; adjust factor as needed

            // Introduce a threshold for negative impact
            if (timeElapsedInHours > 48) { // For posts older than 2 days
                recencyScore -= (timeElapsedInHours - 48) * 0.1; // Further penalize for every hour beyond 48
            }

            // Ensure recencyScore does not drop below a certain value
            recencyScore = Math.max(recencyScore, -trendingScore); // Prevent recencyScore from exceeding trendingScore

            return {
                ...post.toObject(),
                trendingScore: trendingScore + recencyScore,
                boostMultiplier: post.boosted ? 2 : 1,
            };
        });

        // Sort by total trending score
        trendingPosts.sort((a, b) => (b.trendingScore * b.boostMultiplier) - (a.trendingScore * a.boostMultiplier));

        // Return posts along with pagination info
        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(await Post.countDocuments() / limit), // Count total posts for pagination without filtering by tags
            posts: trendingPosts,
        });
    } catch (error) {
        console.error('Error fetching trending topics:', error);
        res.status(500).json({ message: 'Failed to retrieve trending topics', error: error.message });
    }
};




const mockTrend= async()=>{
    try {
        console.log('Getting post data from database');
        
        // Fetch posts with pagination
        const posts = await Post.find()
            .populate('author')  // Assuming posts have an author field that references another collection
        
            .limit(Number(15)); // Limit the number of posts returned

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        // Calculate the trending score for each post
        const trendingPosts = posts.map(post => {
            const totalLikes = post.likes.length || 0;
            const totalComments = post.comments?.length || 0;
            const totalShares = post.shares?.length || 0;
            const totalViews = post.views?.length || 0;
            const totalReactions = totalLikes + totalComments + totalShares + totalViews;
            
            // Calculate the time elapsed since the post was created in seconds
            const timeElapsedInSeconds = (new Date() - new Date(post.createdAt)) / 1000; // Time in seconds
            
            // Calculate the trending score as total reactions divided by time since posting
            const trendingScore = timeElapsedInSeconds > 0 ? totalReactions / timeElapsedInSeconds : 0;

            return {
                ...post.toObject(),
                trendingScore // Assign the trending score to each post
            };
        });

        // Sort posts by trending score in descending order (higher score is more trending)
        trendingPosts.sort((a, b) => b.trendingScore - a.trendingScore);

        // Respond with the trending posts
        console.log('trending posts', trendingPosts)
      //  res.status(200).json(trendingPosts);
    } catch (error) {
        console.error('Error fetching trending topics:', error);
       // res.status(500).json({ message: 'Failed to retrieve trending topics', error });
    }
}






// Add or update a trending topic
const addOrUpdateTrendingTopic = async (req, res) => {
    try {
        const { topic, postId } = req.body;
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }

        let topicFound = false;
        globalState.trendingTopics.forEach((trendingTopic) => {
            if (trendingTopic.topic === topic && trendingTopic.post.toString() === postId) {
                trendingTopic.popularity += 1; // Increment the popularity score
                topicFound = true;
            }
        });

        if (!topicFound) {
            globalState.trendingTopics.push({ topic, post: postId, popularity: 1 });
        }

        await globalState.save();
        res.status(201).json(globalState.trendingTopics);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to add or update trending topic', error });
    }
};

// Remove a trending topic
const removeTrendingTopic = async (req, res) => {
    try {
        const { topic } = req.params;
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }

        globalState.trendingTopics = globalState.trendingTopics.filter(
            (trendingTopic) => trendingTopic.topic !== topic
        );

        await globalState.save();
        res.status(200).json(globalState.trendingTopics);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove trending topic', error });
    }
};

// Get all site announcements
const getSiteAnnouncements = async (req, res) => {
    try {
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }
        res.status(200).json(globalState.siteAnnouncements);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve site announcements', error });
    }
};

// Add a site announcement
const addSiteAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }

        globalState.siteAnnouncements.push({ title, content });

        await globalState.save();
        res.status(201).json(globalState.siteAnnouncements);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add site announcement', error });
    }
};

// Remove a site announcement
const removeSiteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }

        globalState.siteAnnouncements = globalState.siteAnnouncements.filter(
            (announcement) => announcement._id.toString() !== id
        );

        await globalState.save();
        res.status(200).json(globalState.siteAnnouncements);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove site announcement', error });
    }
};



const incrementTotalPosts = async () => {
    try {
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            throw new Error('Global state not found');
        }

        // Increment the total posts and posts today
        globalState.systemMetrics.totalPosts += 1;
        globalState.systemMetrics.postsToday += 1;

        await globalState.save();
        console.log('Total posts and posts today incremented successfully');
    } catch (error) {
        console.error('Failed to increment total posts:', error);
    }
};


// Get general global informatioN
const getGlobalInfo = async (req, res) => {
    try {
        // Fetch the global sta

        console.log('it entered the global state for fetching global information')
        const globalState = await GlobalState.findOne();
        if (!globalState) {
            return res.status(404).json({ message: 'Global state not found' });
        }

       
        

        // Send the response
        res.status(200).json(globalState);
    } catch (error) {
        console.error('Failed to retrieve global information:', error);
        res.status(500).json({ message: 'Failed to retrieve global information', error });
    }
};




module.exports = {
    initializeGlobalState,
    getTrendingTopics2,
    getActiveUsers,
    getGlobalInfo,
    addActiveUser,
    getTotalUsersToday,
    updateTotalUsersToday,
    getTrendingTopics,
    updateSystemMetrics,
    incrementTotalPosts, 
    addOrUpdateTrendingTopic,
    removeTrendingTopic,
    getSiteAnnouncements,
    addSiteAnnouncement,
    removeSiteAnnouncement,
};
