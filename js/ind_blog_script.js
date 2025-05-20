// Enhanced ind_blog_script.js with improved related blog tiles styling
// This script updates the related blogs section to match the main blog page design

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
        
        // Add a loading message with animated dots
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-animation';
        loadingDiv.innerHTML = `
            <div style="text-align: center;">
                <div class="spinner" style="margin-bottom: 20px;">
                    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle class="spinner-path" cx="12" cy="12" r="10" fill="none" stroke-width="2"></circle>
                    </svg>
                </div>
                <div style="color: #ffffff; font-size: 1.1rem;">Loading related articles</div>
                <div style="color: #aaaaaa; font-size: 0.9rem; margin-top: 10px;">Please wait...</div>
            </div>
        `;
        relatedBlogsContainer.appendChild(loadingDiv);
        
        // Get the current blog ID from the body attribute or URL
        const currentBlogId = document.body.getAttribute('data-blog-id') || getCurrentBlogIdFromUrl();
        
        if (currentBlogId) {
            // Load related blogs with a slight delay to ensure UI updates first
            setTimeout(() => {
                loadEnhancedRelatedBlogs(currentBlogId);
            }, 800);
        } else {
            console.error('No blog ID detected');
            hideRelatedSection(relatedBlogsContainer);
        }
    }
    
    // Setup other blog functionality
    setupBlogAnimations();
    setupShareLinks();
    createParticlesBackground();
});

// Hide the entire related section if no related blogs
function hideRelatedSection(container) {
    console.log('No related blogs found, hiding section');
    
    // Find the parent blog-related container
    const parentSection = container.closest('.blog-related');
    if (parentSection) {
        // Fade out the entire related blogs section
        parentSection.style.opacity = '1';
        parentSection.style.transition = 'opacity 0.5s ease, max-height 0.8s ease';
        
        setTimeout(() => {
            parentSection.style.opacity = '0';
            setTimeout(() => {
                parentSection.style.maxHeight = '0';
                parentSection.style.overflow = 'hidden';
                parentSection.style.marginTop = '0';
                parentSection.style.paddingTop = '0';
                parentSection.style.paddingBottom = '0';
            }, 500);
        }, 100);
    } else {
        // If parent section not found, just hide the container
        container.style.display = 'none';
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
        'building_rag_systems': 'P002',
        'calculating_ai_roi': 'P003',
        'multilingual_ai': 'P004',
        'predictive_maintenance': 'P005',
        'agentic_workflows': 'P006'
    };
    
    return filenameToId[filename] || null;
}

// Enhanced version of loadRelatedBlogs function that creates tiles similar to blog.html
async function loadEnhancedRelatedBlogs(blogId) {
    try {
        console.log('Loading enhanced related blogs for ID:', blogId);
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
        
        // If we couldn't find the JSON file, use fallback data
        let data;
        if (!response) {
            console.warn('Could not find blogs_list.json, using fallback data');
            data = getFallbackBlogsData();
        } else {
            console.log(`Successfully loaded JSON from ${jsonPath}`);
            data = await response.json();
        }
        
        // Find the current blog to get its related blogs
        const currentBlog = data.blogs.find(blog => blog.id === blogId);
        
        if (!currentBlog) {
            console.warn(`Blog with ID ${blogId} not found, using fallback related blogs`);
            // Use fallback related blogs (all except current one, limit to 3)
            const relatedBlogs = data.blogs.filter(blog => blog.id !== blogId).slice(0, 3);
            renderEnhancedRelatedBlogs(relatedBlogs);
            return;
        }
        
        // Get related blog IDs from current blog or use fallback
        let relatedBlogIds = [];
        if (currentBlog.relevant_blogs && Array.isArray(currentBlog.relevant_blogs) && currentBlog.relevant_blogs.length > 0) {
            relatedBlogIds = currentBlog.relevant_blogs;
        } else {
            // Use all other blogs as related (limited to 3)
            relatedBlogIds = data.blogs.filter(blog => blog.id !== blogId).slice(0, 3).map(blog => blog.id);
        }
        
        console.log('Related blog IDs:', relatedBlogIds);
        
        // Get the related blog objects
        const relatedBlogs = [];
        relatedBlogIds.forEach(id => {
            const blog = data.blogs.find(blog => blog.id === id);
            if (blog) {
                relatedBlogs.push(blog);
            }
        });
        
        console.log('Found related blogs:', relatedBlogs);
        
        // If no related blogs were found, hide the section
        if (relatedBlogs.length === 0) {
            throw new Error('No matching related blogs found');
        }
        
        // Render the related blogs with enhanced styling
        renderEnhancedRelatedBlogs(relatedBlogs);
        
    } catch (error) {
        console.error('Error loading enhanced related blogs:', error);
        hideRelatedSection(document.getElementById('related-blogs-container'));
    }
}

// Render related blogs with enhanced styling that matches the blog tiles
function renderEnhancedRelatedBlogs(blogs) {
    const relatedBlogsContainer = document.getElementById('related-blogs-container');
    
    // Clear previous content
    relatedBlogsContainer.innerHTML = '';
    
    // Map categories to appropriate icons
    const categoryIcons = {
        'AI Solutions': 'help-circle',
        'Implementation': 'tool',
        'Industry': 'inbox',
        'AI Strategy': 'star',
        'Technical Papers': 'activity',
        'Smart Cities': 'map-pin',
        'Case Studies': 'message-square',
        'BIM': 'layers',
        'Infrastructure': 'home',
        'Digital Twins': 'copy',
        'Urban Planning': 'grid',
        'Optimization': 'sliders',
        'Algorithms': 'code'
    };
    
    // Create each related blog tile
    blogs.forEach((blog, index) => {
        // Create wrapper for glow effect
        const wrapperElement = document.createElement('div');
        wrapperElement.className = 'glow-wrapper';
        
        // Format date
        const dateObj = new Date(blog.created_date || '2025-05-15');
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Get icon for category
        const categoryName = blog.category || 'AI Solutions';
        const categoryIcon = categoryIcons[categoryName] || 'help-circle';
        const iconSvg = getIconSvg(categoryIcon);
        
        // Create tile element
        const tileElement = document.createElement('a');
        tileElement.href = blog.html_page || `../blogs/${blog.id.toLowerCase()}.html`;
        tileElement.className = 'blog-related-post';
        tileElement.setAttribute('data-category', categoryName);
        tileElement.setAttribute('data-id', blog.id);
        
        // Create a beautiful HTML structure for the tile
        tileElement.innerHTML = `
            <div class="tile-id">${blog.id}</div>
            <div class="tile-category">${categoryName}</div>
            <div class="category-icon">
                ${iconSvg}
                <div class="icon-light"></div>
            </div>
            <h3>${blog.title}</h3>
            <p>${blog.description || ''}</p>
            <div class="tile-date">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${formattedDate}
            </div>
        `;
        
        // Create glow element
        const glowElement = document.createElement('div');
        glowElement.className = 'tile-glow';
        
        // Append elements to the DOM
        wrapperElement.appendChild(tileElement);
        wrapperElement.appendChild(glowElement);
        relatedBlogsContainer.appendChild(wrapperElement);
        
        // Animate in with delay
        setTimeout(() => {
            tileElement.classList.add('visible');
        }, 100 + index * 150);
    });
}

// Create floating particles in the background of related blogs section
function createParticlesBackground() {
    const particlesBackground = document.getElementById('particles-background');
    
    // If the particles background doesn't exist, create it
    if (!particlesBackground) {
        const relatedBlogsSection = document.querySelector('.blog-related');
        if (!relatedBlogsSection) return;
        
        // Create particles background
        const newParticlesBackground = document.createElement('div');
        newParticlesBackground.id = 'particles-background';
        newParticlesBackground.className = 'particles-background';
        
        // Add particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'blog-particle';
            
            // Random positioning
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            
            particle.style.top = `${top}%`;
            particle.style.left = `${left}%`;
            
            // Random direction
            const xDirection = Math.random() > 0.5 ? '50px' : '-50px';
            particle.style.setProperty('--x-direction', xDirection);
            
            // Animation
            particle.style.animation = `floatParticle ${5 + Math.random() * 10}s linear infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            newParticlesBackground.appendChild(particle);
        }
        
        // Insert at the beginning of the container
        relatedBlogsSection.insertBefore(newParticlesBackground, relatedBlogsSection.firstChild);
    } else {
        // If it already exists, make sure it has enough particles
        if (particlesBackground.children.length < 15) {
            // Add more particles
            const currentCount = particlesBackground.children.length;
            for (let i = 0; i < 15 - currentCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'blog-particle';
                
                // Random positioning
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                
                particle.style.top = `${top}%`;
                particle.style.left = `${left}%`;
                
                // Random direction
                const xDirection = Math.random() > 0.5 ? '50px' : '-50px';
                particle.style.setProperty('--x-direction', xDirection);
                
                // Animation
                particle.style.animation = `floatParticle ${5 + Math.random() * 10}s linear infinite`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                
                particlesBackground.appendChild(particle);
            }
        }
    }
}

// Animate blog elements when they come into view
function setupBlogAnimations() {
    // Only set up animations if we're on a blog page with content to animate
    const blogContent = document.querySelector('.blog-content');
    if (!blogContent) return;
    
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        root: null, // Use viewport
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: '0px 0px -50px 0px' // Offset trigger point for better timing
    });
    
    // Get all elements to animate
    const elementsToAnimate = document.querySelectorAll('.blog-content h2, .blog-content img, .highlight-box, .blog-chat-example, .blog-cta');
    
    // Set initial styles and observe
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Setup share functionality with enhanced features
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
                        // Copy to clipboard fallback
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(url).then(() => {
                                alert('Link copied to clipboard!');
                            }).catch(err => {
                                alert('Use this link to share: ' + url);
                            });
                        } else {
                            // Fallback for unsupported browsers
                            alert('Use this link to share: ' + url);
                        }
                    }
            }
        });
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Helper function to get SVG icon based on icon name
function getIconSvg(iconName) {
    const icons = {
        'star': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>',
        'activity': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>',
        'message-square': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
        'tool': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
        'inbox': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
        'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        'layers': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
        'home': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
        'code': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        'sliders': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>',
        'copy': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
        'grid': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        'help-circle': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    };
    
    return icons[iconName] || icons['help-circle'];
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
                "relevant_blogs": ["P006", "P002", "P005"]
            },
            {
                "id": "P002",
                "title": "Building RAG Systems for Indian Healthcare: PM-JAY Case Study",
                "description": "Implementation details and challenges in developing retrieval-augmented generation for the PM-JAY healthcare system.",
                "category": "Implementation",
                "html_page": "blogs/building_rag_systems.html",
                "created_date": "2025-04-28",
                "relevant_blogs": ["P001", "P003"]
            },
            {
                "id": "P003",
                "title": "Calculating AI ROI for Indian Enterprises: Beyond Conventional Metrics",
                "description": "Innovative approaches to measuring the return on investment for AI initiatives in the Indian context.",
                "category": "AI Strategy",
                "html_page": "blogs/calculating_ai_roi.html",
                "created_date": "2025-04-15",
                "relevant_blogs": ["P002", "P004"]
            },
            {
                "id": "P004",
                "title": "Multilingual AI: Bridging Language Barriers in India's Digital Transformation",
                "description": "Technical approaches to developing AI systems that work effectively across India's diverse linguistic landscape.",
                "category": "Technical Papers",
                "html_page": "blogs/multilingual_ai.html",
                "created_date": "2025-04-08",
                "relevant_blogs": ["P003", "P006"]
            },
            {
                "id": "P005",
                "title": "AI-Powered Predictive Maintenance: Transforming Indian Manufacturing",
                "description": "Case studies and implementation strategies for predictive maintenance in India's manufacturing sector.",
                "category": "Industry",
                "html_page": "blogs/predictive_maintenance.html",
                "created_date": "2025-03-25",
                "relevant_blogs": ["P001", "P006"]
            },
            {
                "id": "P006",
                "title": "Designing Agentic AI Workflows for Business Process Automation",
                "description": "Technical architecture and implementation guidelines for creating autonomous AI workflows.",
                "category": "Technical Papers",
                "html_page": "blogs/agentic_workflows.html",
                "created_date": "2025-03-12",
                "relevant_blogs": ["P001", "P005"]
            }
        ]
    };
}
