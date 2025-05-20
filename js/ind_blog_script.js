// Enhanced ind_blog_script.js with text-based related blog links
// This script ensures related articles are displayed properly

// Flag to track if we've already tried loading blogs
let hasAttemptedLoading = false;

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a blog page by looking for the related-blogs-container
    const relatedBlogsContainer = document.getElementById('related-blogs-container');
    if (relatedBlogsContainer && !hasAttemptedLoading) {
        console.log('Blog page detected, loading related blogs');
        hasAttemptedLoading = true;
        
        // Clear the container completely - remove all fallback content
        relatedBlogsContainer.innerHTML = '';
        
        // Add a loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        loadingDiv.textContent = 'Loading related articles...';
        relatedBlogsContainer.appendChild(loadingDiv);
        
        // Get the current blog ID from the body attribute or URL
        const currentBlogId = document.body.getAttribute('data-blog-id') || getCurrentBlogIdFromUrl();
        
        if (currentBlogId) {
            console.log('Found blog ID:', currentBlogId);
            
            // Load related blogs with a slight delay to ensure UI updates first
            setTimeout(() => {
                loadRelatedBlogs(currentBlogId);
            }, 300); // Short delay for better user experience
        } else {
            console.error('No blog ID detected');
            showFallbackRelatedBlogs(relatedBlogsContainer);
        }
    } else {
        console.log('Not a blog page or already loaded');
    }
});

// Extract blog ID from URL if needed
function getCurrentBlogIdFromUrl() {
    // This is a fallback method to get the blog ID from the URL
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    
    // Map filename to blog ID - you may need to customize this based on your URL structure
    const filenameToId = {
        'metro_design_agentic_ai': 'P001',
        'building_rag_systems': 'P002',
        'calculating_ai_roi': 'P003',
        'multilingual_ai': 'P004',
        'predictive_maintenance': 'P005',
        'agentic_workflows': 'P006'
    };
    
    return filenameToId[filename] || null;
}

// Function to fetch related blogs from JSON file
async function loadRelatedBlogs(blogId) {
    try {
        console.log('Loading related blogs for ID:', blogId);
        const relatedBlogsContainer = document.getElementById('related-blogs-container');
        
        // Try to get fallback data directly since fetching might fail
        const fallbackData = getFallbackBlogsData();
        let data = fallbackData;  // Use fallback data by default
        
        // Try fetching the JSON file from various possible paths
        const possiblePaths = [
            '../data/blogs_list.json',
            './data/blogs_list.json',
            '/data/blogs_list.json'
        ];
        
        let foundJson = false;
        
        for (const path of possiblePaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    data = await response.json();
                    console.log(`Successfully loaded JSON from ${path}`);
                    foundJson = true;
                    break;
                }
            } catch (error) {
                console.log(`Path ${path} failed: ${error.message}`);
            }
        }
        
        if (!foundJson) {
            console.warn('Could not find blogs_list.json, using fallback data');
        }
        
        // Find the current blog to get its related blogs
        const currentBlog = data.blogs.find(blog => blog.id === blogId);
        
        let relatedBlogs = [];
        
        if (!currentBlog) {
            console.warn(`Blog with ID ${blogId} not found, using fallback related blogs`);
            // Use fallback related blogs (all blogs except current one, limit to 3)
            relatedBlogs = data.blogs.filter(blog => blog.id !== blogId).slice(0, 3);
        } else if (!currentBlog.relevant_blogs || !Array.isArray(currentBlog.relevant_blogs) || currentBlog.relevant_blogs.length === 0) {
            console.warn(`No relevant blogs defined for blog ${blogId}, using fallback`);
            // Use fallback related blogs (all blogs except current one, limit to 3)
            relatedBlogs = data.blogs.filter(blog => blog.id !== blogId).slice(0, 3);
        } else {
            const relatedBlogIds = currentBlog.relevant_blogs;
            console.log('Related blog IDs:', relatedBlogIds);
            
            // Get the related blog objects based on their IDs
            relatedBlogIds.forEach(id => {
                const blog = data.blogs.find(blog => blog.id === id);
                if (blog) {
                    relatedBlogs.push(blog);
                }
            });
        }
        
        console.log('Found related blogs:', relatedBlogs);
        
        // If no related blogs were found at all, show fallback
        if (relatedBlogs.length === 0) {
            console.warn('No matching related blogs found, showing fallback');
            showFallbackRelatedBlogs(relatedBlogsContainer);
            return;
        }
        
        // Remove loading message and any old content
        relatedBlogsContainer.innerHTML = '';
        
        // Render the related blogs
        renderRelatedBlogs(relatedBlogs);
        
    } catch (error) {
        console.error('Error loading related blogs:', error);
        showFallbackRelatedBlogs(document.getElementById('related-blogs-container'));
    }
}

// Function to render related blogs as text links
function renderRelatedBlogs(blogs) {
    const relatedBlogsContainer = document.getElementById('related-blogs-container');
    
    // Create a list element
    const listElement = document.createElement('ul');
    listElement.className = 'blog-related-text-list';
    
    blogs.forEach((blog, index) => {
        // Create list item
        const listItem = document.createElement('li');
        listItem.className = 'blog-related-text-item';
        
        // Create link
        const link = document.createElement('a');
        link.href = blog.html_page || `../blogs/${blog.id.toLowerCase()}.html`;
        link.className = 'blog-related-text-link';
        
        // Format with ID and Title
        link.innerHTML = `<span class="blog-id">${blog.id}</span> - ${blog.title}`;
        
        // Add description as title attribute for tooltip
        if (blog.description) {
            link.setAttribute('title', blog.description);
        }
        
        // Add link to list item
        listItem.appendChild(link);
        
        // Add to list
        listElement.appendChild(listItem);
        
        // Add animation with delay
        setTimeout(() => {
            listItem.classList.add('visible');
        }, 100 + index * 150);
    });
    
    // Add list to container
    relatedBlogsContainer.appendChild(listElement);
}

// Function to show fallback related blogs
function showFallbackRelatedBlogs(container) {
    container.innerHTML = '';
    
    // Create fallback blogs
    const fallbackBlogs = [
        {
            title: "Designing Agentic AI Workflows for Business Process Automation",
            description: "Technical architecture and implementation guidelines for creating autonomous AI workflows.",
            category: "AI Solutions",
            id: "P006"
        },
        {
            title: "Calculating AI ROI for Indian Enterprises: Beyond Conventional Metrics",
            description: "Innovative approaches to measuring the return on investment for AI initiatives in the Indian context.",
            category: "AI Strategy",
            id: "P003"
        },
        {
            title: "AI-Powered Predictive Maintenance: Transforming Indian Manufacturing",
            description: "Case studies and implementation strategies for predictive maintenance in India's manufacturing sector.",
            category: "Industry",
            id: "P005"
        }
    ];
    
    // Render the fallback blogs
    renderRelatedBlogs(fallbackBlogs);
}

// Fallback data for blogs
function getFallbackBlogsData() {
    return {
        "categories": ["All", "AI Solutions", "Implementation", "Technical Papers", "Industry", "AI Strategy"],
        "blogs": [
            {
                "id": "P001",
                "title": "Agentic AI in Metro Design: Imagine Your Engineers Having Smart Digital Assistants",
                "description": "How agentic AI systems are revolutionizing metro infrastructure design in India, reducing design time by 40% while enhancing quality.",
                "category": "AI Solutions",
                "html_page": "blogs/metro_design_agentic_ai.html",
                "created_date": "2025-05-15",
                "relevant_blogs": ["P006", "P003", "P005"]
            },
            {
                "id": "P002",
                "title": "Building RAG Systems for Indian Healthcare: PM-JAY Case Study",
                "description": "Implementation details and challenges in developing retrieval-augmented generation for the PM-JAY healthcare system.",
                "category": "Implementation",
                "html_page": "blogs/building_rag_systems.html",
                "created_date": "2025-04-28"
            },
            {
                "id": "P003",
                "title": "Calculating AI ROI for Indian Enterprises: Beyond Conventional Metrics",
                "description": "Innovative approaches to measuring the return on investment for AI initiatives in the Indian context.",
                "category": "AI Strategy",
                "html_page": "blogs/calculating_ai_roi.html",
                "created_date": "2025-04-15"
            },
            {
                "id": "P004",
                "title": "Multilingual AI: Bridging Language Barriers in India's Digital Transformation",
                "description": "Technical approaches to developing AI systems that work effectively across India's diverse linguistic landscape.",
                "category": "Technical Papers",
                "html_page": "blogs/multilingual_ai.html",
                "created_date": "2025-04-08"
            },
            {
                "id": "P005",
                "title": "AI-Powered Predictive Maintenance: Transforming Indian Manufacturing",
                "description": "Case studies and implementation strategies for predictive maintenance in India's manufacturing sector.",
                "category": "Industry",
                "html_page": "blogs/predictive_maintenance.html",
                "created_date": "2025-03-25"
            },
            {
                "id": "P006",
                "title": "Designing Agentic AI Workflows for Business Process Automation",
                "description": "Technical architecture and implementation guidelines for creating autonomous AI workflows.",
                "category": "Technical Papers",
                "html_page": "blogs/agentic_workflows.html",
                "created_date": "2025-03-12"
            }
        ]
    };
}
