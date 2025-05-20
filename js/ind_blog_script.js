// js/ind_blog_script.js

// Flag to track if we've already tried loading blogs
let hasAttemptedLoading = false;

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a blog page by looking for the related-blogs-container
    const relatedBlogsContainer = document.getElementById('related-blogs-container');
    if (relatedBlogsContainer && !hasAttemptedLoading) {
        console.log('Blog page detected, loading related blogs');
        hasAttemptedLoading = true;
        
        // Store fallback content before hiding
        const fallbackContent = Array.from(relatedBlogsContainer.querySelectorAll('.fallback-content'));
        
        // Hide fallback content immediately to prevent flicker
        fallbackContent.forEach(element => {
            element.style.display = 'none';
        });
        
        // Add a loading message that will be replaced
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        loadingDiv.textContent = 'Loading related articles...';
        relatedBlogsContainer.appendChild(loadingDiv);
        
        // Get the current blog ID from the body attribute or URL
        const currentBlogId = document.body.getAttribute('data-blog-id') || getCurrentBlogIdFromUrl();
        
        if (currentBlogId) {
            // Load related blogs with a slight delay to ensure UI updates first
            setTimeout(() => {
                loadRelatedBlogs(currentBlogId, fallbackContent);
            }, 100);
        } else {
            console.error('No blog ID detected');
            restoreFallbackContent(relatedBlogsContainer, fallbackContent);
        }
    }
    
    // Setup other blog functionality
    setupBlogAnimations();
    setupShareLinks();
});

// Restore fallback content if dynamic loading fails
function restoreFallbackContent(container, fallbackElements) {
    console.log('Restoring fallback content');
    
    // Remove any loading messages
    const loadingMessages = container.querySelectorAll('.loading-message');
    loadingMessages.forEach(el => el.remove());
    
    // Show the fallback content
    if (fallbackElements && fallbackElements.length > 0) {
        fallbackElements.forEach(element => {
            element.style.display = 'block';
        });
    } else {
        container.innerHTML = '<p>Unable to load related articles.</p>';
    }
}

// Extract blog ID from URL if needed
function getCurrentBlogIdFromUrl() {
    // This is a fallback method to get the blog ID from the URL
    // Example: if URL is /blogs/metro_design_agentic_ai.html, look for a way to map to P001
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    
    // Map filename to blog ID - you may need to customize this based on your URL structure
    const filenameToId = {
        'metro_design_agentic_ai': 'P001',
        // Add other mappings as needed
    };
    
    return filenameToId[filename] || null;
}

// Function to fetch related blogs from JSON file
async function loadRelatedBlogs(blogId, fallbackElements) {
    try {
        console.log('Loading related blogs for ID:', blogId);
        const relatedBlogsContainer = document.getElementById('related-blogs-container');
        
        // Fetch the blogs data from JSON file with multiple path attempts
        const possiblePaths = [
            '../data/blogs_list.json',
            './data/blogs_list.json',
            '/data/blogs_list.json'
        ];
        
        let response = null;
        let jsonPath = '';
        
        // Try all possible paths until one works
        for (const path of possiblePaths) {
            try {
                const tempResponse = await fetch(path);
                if (tempResponse.ok) {
                    response = tempResponse;
                    jsonPath = path;
                    break;
                }
            } catch (error) {
                console.log(`Path ${path} failed: ${error.message}`);
            }
        }
        
        if (!response) {
            throw new Error('Could not find blogs_list.json in any of the expected locations');
        }
        
        console.log(`Successfully loaded JSON from ${jsonPath}`);
        const data = await response.json();
        
        // Find the current blog to get its related blogs
        const currentBlog = data.blogs.find(blog => blog.id === blogId);
        
        if (!currentBlog) {
            throw new Error(`Blog with ID ${blogId} not found`);
        }
        
        if (!currentBlog.relevant_blogs || !Array.isArray(currentBlog.relevant_blogs) || currentBlog.relevant_blogs.length === 0) {
            throw new Error(`No relevant blogs defined for blog ${blogId}`);
        }
        
        const relatedBlogIds = currentBlog.relevant_blogs;
        console.log('Related blog IDs:', relatedBlogIds);
        
        const relatedBlogs = [];
        
        // Get the related blog objects based on their IDs
        relatedBlogIds.forEach(id => {
            const blog = data.blogs.find(blog => blog.id === id);
            if (blog) {
                relatedBlogs.push(blog);
            }
        });
        
        console.log('Found related blogs:', relatedBlogs);
        
        // If no related blogs were found, show fallback content
        if (relatedBlogs.length === 0) {
            throw new Error('No matching related blogs found');
        }
        
        // Remove loading message and any old content
        relatedBlogsContainer.innerHTML = '';
        
        // Add dynamic content - create new elements
        relatedBlogs.forEach(blog => {
            // Create the blog post element
            const blogPost = document.createElement('div');
            blogPost.className = 'blog-related-post';
            
            // Create the image element
            const img = document.createElement('img');
            img.className = 'blog-related-image';
            img.alt = blog.title;
            
            // Try to create an appropriate image path
            if (blog.category) {
                img.src = `images/${blog.category.toLowerCase().replace(/\s+/g, '_')}.jpg`;
            } else {
                img.src = `images/${blog.id.toLowerCase()}_thumb.jpg`;
            }
            
            // Add error handler for image
            img.onerror = function() {
                this.src = 'images/placeholder.jpg';
            };
            
            // Create content container
            const contentDiv = document.createElement('div');
            contentDiv.className = 'blog-related-content';
            
            // Add title
            const title = document.createElement('h4');
            title.className = 'blog-related-post-title';
            title.textContent = blog.title;
            
            // Add excerpt
            const excerpt = document.createElement('p');
            excerpt.className = 'blog-related-excerpt';
            excerpt.textContent = blog.description;
            
            // Add read more link with SVG
            const link = document.createElement('a');
            link.className = 'blog-related-link';
            link.href = blog.html_page;
            link.innerHTML = 'Read More <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
            
            // Assemble the elements
            contentDiv.appendChild(title);
            contentDiv.appendChild(excerpt);
            contentDiv.appendChild(link);
            
            blogPost.appendChild(img);
            blogPost.appendChild(contentDiv);
            
            // Add the post to the container
            relatedBlogsContainer.appendChild(blogPost);
        });
        
    } catch (error) {
        console.error('Error loading related blogs:', error);
        restoreFallbackContent(document.getElementById('related-blogs-container'), fallbackElements);
    }
}

// Animate blog elements when they come into view
function setupBlogAnimations() {
    // Only set up animations if we're on a blog page with content to animate
    const blogContent = document.querySelector('.blog-content');
    if (!blogContent) return;
    
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.blog-content h2, .blog-content img, .highlight-box, .blog-chat-example, .blog-cta');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles
    const elementsToAnimate = document.querySelectorAll('.blog-content h2, .blog-content img, .highlight-box, .blog-chat-example, .blog-cta');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Run once on load
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
}

// Setup share functionality
function setupShareLinks() {
    const shareLinks = document.querySelectorAll('.blog-share-link');
    if (shareLinks.length === 0) return;
    
    shareLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Get the current URL to share
            const url = window.location.href;
            const title = document.title;
            
            // Determine which platform was clicked
            const platform = this.getAttribute('data-platform') || 'generic';
            
            // Handle different sharing platforms
            switch(platform) {
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, 'Share on Facebook', 'width=600,height=400');
                    break;
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, 'Share on Twitter', 'width=600,height=400');
                    break;
                case 'linkedin':
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, 'Share on LinkedIn', 'width=600,height=400');
                    break;
                default:
                    // Fallback for browsers that support the Web Share API
                    if (navigator.share) {
                        navigator.share({
                            title: title,
                            url: url
                        }).catch(console.error);
                    } else {
                        // Fallback for unsupported browsers
                        alert('Use this link to share: ' + url);
                    }
            }
        });
    });
}
