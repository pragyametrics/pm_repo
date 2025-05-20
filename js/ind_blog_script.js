// js/ind_blog_script.js

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a blog page by looking for the related-blogs-container
    const relatedBlogsContainer = document.getElementById('related-blogs-container');
    if (relatedBlogsContainer) {
        // Get the current blog ID from the body attribute or URL
        const currentBlogId = document.body.getAttribute('data-blog-id') || getCurrentBlogIdFromUrl();
        
        if (currentBlogId) {
            loadRelatedBlogs(currentBlogId);
        } else {
            console.error('No blog ID detected');
            relatedBlogsContainer.innerHTML = '<p>Unable to load related articles.</p>';
        }
    }
    
    // Setup other blog functionality
    setupBlogAnimations();
    setupShareLinks();
});

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
async function loadRelatedBlogs(blogId) {
    try {
        console.log('Loading related blogs for ID:', blogId);
        const relatedBlogsContainer = document.getElementById('related-blogs-container');
        
        // Fetch the blogs data from JSON file
        const response = await fetch('../data/blogs_list.json');
        if (!response.ok) {
            throw new Error(`Failed to load blog data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded blog data:', data);
        
        // Find the current blog to get its related blogs
        const currentBlog = data.blogs.find(blog => blog.id === blogId);
        
        if (!currentBlog) {
            throw new Error(`Blog with ID ${blogId} not found`);
        }
        
        if (!currentBlog.relevant_blogs || !Array.isArray(currentBlog.relevant_blogs)) {
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
        
        // Clear loading message
        relatedBlogsContainer.innerHTML = '';
        
        // If no related blogs were found, show a message
        if (relatedBlogs.length === 0) {
            relatedBlogsContainer.innerHTML = '<p>No related articles found.</p>';
            return;
        }
        
        // Render each related blog
        relatedBlogs.forEach(blog => {
            // Create placeholder images based on blog category or a default image
            let imageUrl;
            if (blog.category) {
                imageUrl = `../images/${blog.category.toLowerCase().replace(/\s+/g, '_')}.jpg`;
            } else {
                imageUrl = '../images/placeholder.jpg';
            }
            
            // Create HTML for the related blog
            const blogHtml = `
                <div class="blog-related-post">
                    <img src="${imageUrl}" alt="${blog.title}" class="blog-related-image" onerror="this.src='../images/placeholder.jpg'">
                    <div class="blog-related-content">
                        <h4 class="blog-related-post-title">${blog.title}</h4>
                        <p class="blog-related-excerpt">${blog.description}</p>
                        <a href="${blog.html_page}" class="blog-related-link">Read More <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
                    </div>
                </div>
            `;
            
            relatedBlogsContainer.innerHTML += blogHtml;
        });
        
    } catch (error) {
        console.error('Error loading related blogs:', error);
        document.getElementById('related-blogs-container').innerHTML = 
            `<p>Unable to load related articles. Error: ${error.message}</p>`;
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
