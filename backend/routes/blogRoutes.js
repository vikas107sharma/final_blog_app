const express = require('express');
const authMiddleware = require('../components/middleware/authMiddleware');
const BlogModal = require('../modal/BlogModal');
const { default: mongoose } = require('mongoose');
const router = express.Router();


// api for show like dislike details for public user

router.post('/:id/details/public', async (req, res) => {
    try {
        const { id: postId } = req.params;

        const blog = await BlogModal.findById({ _id: postId });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        const response = {
            likes: blog.likes,
            dislikes: blog.dislikes,
            views: blog.views,
        }

        res.status(200).json(response);
    } catch (error) {
        console.log("Error with like on the blog", error)
        res.status(500).json({ message: 'Error with like on the blog.' });

    }

})
// api for show like dislike details for loggedin user

router.post('/:id/details', authMiddleware, async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: postId } = req.params;

        const blog = await BlogModal.findById({ _id: postId });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        const response = {
            likes: blog.likes,
            dislikes: blog.dislikes,
            views: blog.views,
            userLiked: blog?.likedBy?.includes(userId),
            userDisliked: blog?.dislikedBy?.includes(userId)
        }

        res.status(200).json(response);
    } catch (error) {
        console.log("Error with like on the blog", error)
        res.status(500).json({ message: 'Error with like on the blog.' });

    }

})



//post like api
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: postId } = req.params;

        const blog = await BlogModal.findById({ _id: postId });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }
        console.log(blog)
        // return

        if (blog?.likedBy?.includes(userId)) {
            //user is unliking
            blog.likedBy = blog?.likedBy?.filter(id => id.toString() !== userId.toString());
        } else {
            // Remove dislike if the user had disliked
            blog.dislikedBy = blog?.dislikedBy?.filter(id => id.toString() !== userId.toString());
            blog.likedBy?.push(userId);
        }

        // Update like and dislike counts
        blog.likes = blog?.likedBy?.length;
        blog.dislikes = blog?.dislikedBy?.length;

        await blog.save();

        res.status(200).json({ message: 'Like worked!', likes: blog.likes, dislikes: blog.dislikes });
    } catch (error) {
        console.log("Error with like on the blog", error)
        res.status(500).json({ message: 'Error with like on the blog.' });

    }

})

//post dislike api
router.post('/:id/dislike', authMiddleware, async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: postId } = req.params;

        const blog = await BlogModal.findById({ _id: postId });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }
        console.log(blog)
        // return

        if (blog?.dislikedBy?.includes(userId)) {
            // User is removing their dislike
            blog.dislikedBy = blog?.dislikedBy?.filter(id => id.toString() !== userId.toString());
        } else {
            // Remove like if the user had liked
            blog.likedBy = blog?.dislikedBy?.filter(id => id.toString() !== userId.toString());
            // Add the user to the dislikedBy array
            blog.dislikedBy?.push(userId);
        }

        // Update like and dislike counts
        blog.likes = blog?.likedBy?.length;
        blog.dislikes = blog?.dislikedBy?.length;

        await blog.save();

        res.status(200).json({ message: 'DisLike worked!', likes: blog.likes, dislikes: blog.dislikes });
    } catch (error) {
        console.log("Error with dislike on the blog", error)
        res.status(500).json({ message: 'Error with dislike on the blog.' });

    }

})


//blog view count
router.post('/:id/view-count', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await BlogModal.findById({ _id: id });
        blog.views += 1;
        await blog.save();
        res.status(200).json({ message: 'View incremented!', views: blog.views });
    } catch (error) {
        console.log("error view increase", error)
        res.status(500).json({ message: 'Error incrementing view count.' });
    }

})

router.post('/create-post', authMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const { title, content, image } = req.body; // Extract the image field

        // Validation for title
        if (!title || title.length < 5) {
            return res.status(400).json({ error: 'Title is required and must be at least 5 characters long' });
        }

        // Validation for content
        if (!content || content.length < 10) {
            return res.status(400).json({ error: 'Content is required and must be at least 10 characters long' });
        }

        // Optional validation for the image field
        if (image && typeof image !== 'string') {
            return res.status(400).json({ error: 'Image must be a valid URL or string' });
        }

        // Create a new blog post
        const newBlog = new BlogModal({
            title,
            content,
            image, // Add the image field
            author: userData.id,
        });

        // Save the blog post to the database
        const saveBlog = await newBlog.save();

        return res.status(201).json({ message: "Data saved", data: saveBlog });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while creating the blog post' });
    }
});


//Update post
router.put('/update-post/:id', authMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const { id } = req.params;
        const { title, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Invalid Blog Id' });

        if (!title || title.length < 5) {
            return res.status(400).json({ error: 'Title is required and must be at least 5 characters long' });
        }
        if (!content || content.length < 10) {
            return res.status(400).json({ error: 'Content is required and must be at least 10 characters long' });
        }

        const blog = await BlogModal.findOne({ _id: id, author: userData.id });
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found or you do not have permission to update this post' });
        }

        blog.title = title;
        blog.content = content;
        // blog.updatedAt = new Date();

        const updateBlog = await blog.save();

        return res.status(200).json({ message: "Blog update successfully", data: updateBlog })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while updating the blog post' });
    }
})


router.post('/my-posts', authMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const blogs = await BlogModal.find({ author: userData.id })
        if (blogs.length == 0) return res.status(404).json({ message: 'No blogs found for this user' });
        return res.status(200).json(blogs);

    } catch (error) {

    }
})

router.get('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Invalid Blog Id' });

        const blog = await BlogModal.findOne({ _id: id, author: userData.id })

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found!' });
        }

        await BlogModal.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Blog post deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while deleting the blog post' });

    }
})


//this if for public
router.get('/blogs', async (req, res) => {
    try {
        // const blogs = await BlogModal.find();
        const blogs = await BlogModal.find().populate('author', 'name'); // Populate the 'author' field with 'name'
        if (blogs.length == 0) return res.status(404).json({ message: 'No blogs found' });
        return res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await BlogModal.findById(id).populate('author', 'name');;
        if (!blog) return res.status(404).json({ message: 'Blog post not found' });
        return res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



module.exports = router