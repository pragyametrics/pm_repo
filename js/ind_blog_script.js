// Enhanced ind_blog_script.js with optimized code for text-based related articles
// This script ensures related articles are displayed properly

// Flag to track if we've already tried loading blogs
let hasAttemptedLoading = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation observers for page content
    initContentObservers();
    
    // Handle related blogs loading
    loadRelatedBlogs();
    
    // Fix URL paths after a delay
    setTimeout(fixRelatedBlogUrls, 1000);
});

// Initialize observers for animations
function initContentObservers() {
    // Create observer for main content elements
    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    
    // Observe main content sections
    document.querySelectorAll('h2, .blog-image, .highlight-box, .blog-chat-example, .blog-cta').forEach(element => {
        contentObserver.observe(element);
    });
    
    // Create observer for related blog container
    const relatedBlogsContainer = document.getElementById('related-blogs-container');
    if (relatedBlogsContainer) {
        // Create a mutation observer to watch for when items are added
        const relatedBlogsMutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    // Find all newly added related blog items
                    const relatedItems = relatedBlogsContainer.querySelectorAll('.blog-related-text-item:not(.observer-ready)');
                    
                    if (relatedItems.length > 0) {
                        // Create intersection observer for related items
                        const relatedItemsObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry, index) => {
                                if (entry.isIntersecting) {
                                    // Add visible class with staggered delay
                                    setTimeout(() => {
                                        entry.target.classList.add('visible');
                                    }, index * 150);
                                    
                                    // Unobserve after animation
                                    relatedItemsObserver.unobserve(entry.target);
                                }
                            });
                        }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
                        
                        // Observe each item and mark as ready
                        relatedItems.forEach(item => {
                            relatedItemsObserver.observe(item);
                            item.classList.add('observer-ready');
                        });
                    }
                }
            });
        });
        
        // Start observing the container for added nodes
        relatedBlogsMutationObserver.observe(relatedBlogsContainer, { childList: true });
    }
}

// Main function to load related blogs
function loadRelatedBlogs() {
    // Check if we're on a blog page
    const relatedBlogsContainer = document.getElementById('related-blogs-container');
    if (relatedBlogsContainer && !hasAttemptedLoading) {
        console.log('Blog page detected, loading related blogs');
        hasAttemptedLoading = true;
        
        // Clear the container
        relatedBlogsContainer.innerHTML = '';
        
        // Add a loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        loadingDiv.textContent = 'Loading related articles...';
        relatedBlogsContainer.appendChild(loadingDiv);
        
        // Get the current blog ID
        const currentBlogId = document.body.getAttribute('data-blog-id') || getCurrentBlogIdFromUrl();
        
        if (currentBlogId) {
            console.log('Found blog ID:', currentBlogId);
            
            // Load related blogs with a slight delay
            setTimeout(() => {
                fetchRelatedBlogs(currentBlogId);
            }, 300);
        } else {
            console.error('No blog ID detected');
            showFallbackRelatedBlogs(relatedBlogsContainer);
        }
    }
}

// Extract blog ID from URL if needed
function getCurrentBlogIdFromUrl() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    
    // Map filename to blog ID
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

// Function to fetch related blogs
async function fetchRelatedBlogs(blogId) {
    try {
        console.log('Loading related blogs for ID:', blogId);
        const relatedBlogsContainer = document.getElementById('related-blogs-container');
        
        // Get fallback data as default
        const fallbackData = getFallbackBlogsData();
        let data = fallbackData;
        
        // Try fetching the JSON file from possible paths
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
            console.warn('Using fallback data');
        }
        
        // Find the current blog's related blogs
        const currentBlog = data.blogs.find(blog => blog.id === blogId);
        let relatedBlogs = [];
        
        if (!currentBlog || !currentBlog.relevant_blogs || !Array.isArray(currentBlog.relevant_blogs) || currentBlog.relevant_blogs.length === 0) {
            // Use fallback related blogs
            relatedBlogs = data.blogs.filter(blog => blog.id !== blogId).slice(0, 3);
        } else {
            // Get the related blog objects based on their IDs
            currentBlog.relevant_blogs.forEach(id => {
                const blog = data.blogs.find(blog => blog.id === id);
                if (blog) {
                    relatedBlogs.push(blog);
                }
            });
        }
        
        // If no related blogs were found, show fallback
        if (relatedBlogs.length === 0) {
            console.warn('No matching related blogs found, showing fallback');
            showFallbackRelatedBlogs(relatedBlogsContainer);
            return;
        }
        
        // Remove loading message
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
        
        // Create link with proper URL handling
        const link = document.createElement('a');
        
        // Fix URL path to avoid duplication of /blogs/
        if (blog.html_page && blog.html_page.includes('/blogs/')) {
            link.href = blog.html_page;
        } else if (blog.html_page) {
            link.href = blog.html_page;
        } else {
            link.href = `../blogs/${blog.id.toLowerCase()}.html`;
        }
        
        link.className = 'blog-related-text-link';
        
        // Format with ID and Title
        link.innerHTML = `<span class="blog-id">${blog.id}</span> - ${blog.title}`;
        
        // Add description as tooltip
        if (blog.description) {
            link.setAttribute('title', blog.description);
        }
        
        // Add link to list item
        listItem.appendChild(link);
        
        // Add to list
        listElement.appendChild(listItem);
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

// Fix URL paths to prevent /blogs/blogs/ issue
function fixRelatedBlogUrls() {
    const links = document.querySelectorAll('.blog-related-text-link');
    links.forEach((link) => {
        // Fix double blogs path issue if found
        if (link.href.includes('/blogs/blogs/')) {
            console.log('Fixing double blogs path: ' + link.href);
            link.href = link.href.replace('/blogs/blogs/', '/blogs/');
        }
    });
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
                "html_page": "../blogs/metro_design_agentic_ai.html",
                "created_date": "2025-05-15",
                "relevant_blogs": ["P006", "P003", "P005"]
            },
            {
                "id": "P002",
                "title": "Building RAG Systems for Indian Healthcare: PM-JAY Case Study",
                "description": "Implementation details and challenges in developing retrieval-augmented generation for the PM-JAY healthcare system.",
                "category": "Implementation",
                "html_page": "../blogs/building_rag_systems.html",
                "created_date": "2025-04-28"
            },
            {
                "id": "P003",
                "title": "Calculating AI ROI for Indian Enterprises: Beyond Conventional Metrics",
                "description": "Innovative approaches to measuring the return on investment for AI initiatives in the Indian context.",
                "category": "AI Strategy",
                "html_page": "../blogs/calculating_ai_roi.html",
                "created_date": "2025-04-15"
            },
            {
                "id": "P004",
                "title": "Multilingual AI: Bridging Language Barriers in India's Digital Transformation",
                "description": "Technical approaches to developing AI systems that work effectively across India's diverse linguistic landscape.",
                "category": "Technical Papers",
                "html_page": "../blogs/multilingual_ai.html",
                "created_date": "2025-04-08"
            },
            {
                "id": "P005",
                "title": "AI-Powered Predictive Maintenance: Transforming Indian Manufacturing",
                "description": "Case studies and implementation strategies for predictive maintenance in India's manufacturing sector.",
                "category": "Industry",
                "html_page": "../blogs/predictive_maintenance.html",
                "created_date": "2025-03-25"
            },
            {
                "id": "P006",
                "title": "Designing Agentic AI Workflows for Business Process Automation",
                "description": "Technical architecture and implementation guidelines for creating autonomous AI workflows.",
                "category": "Technical Papers",
                "html_page": "../blogs/agentic_workflows.html",
                "created_date": "2025-03-12"
            }
        ]
    };
}
