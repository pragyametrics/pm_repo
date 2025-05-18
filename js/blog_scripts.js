/* blog_scripts.js - Enhanced with animations */

document.addEventListener('DOMContentLoaded', function() {
    // Load blogs data from JSON file
    fetch('data/blogs_list.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Initialize the blog functionality
            initBlog(data);
            
            // Initialize animations
            initAnimations();
        })
        .catch(error => {
            console.error('Error loading blogs data:', error);
            // Display error message on the page
            document.querySelector('.blog-tiles').innerHTML = `
                <div class="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff4757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <p style="font-size: 1.2rem; color: #444466; margin-bottom: 10px;">Unable to load blog content</p>
                    <p style="color: #7b7b9d;">Please try refreshing the page or check back later.</p>
                </div>
            `;
        });

    // Initialize blog functionality
    function initBlog(data) {
        // Elements
        const blogFilters = document.getElementById('blog-filters');
        const blogTilesContainer = document.getElementById('blog-tiles');
        const searchInput = document.getElementById('search-input');
        
        // Populate filter categories dynamically
        populateFilters(data.categories, blogFilters);
        
        // Render blog tiles
        renderBlogTiles(data.blogs, blogTilesContainer);
        
        // Add event listeners for filters
        addFilterListeners(blogFilters, data.blogs);
        
        // Event listener for search
        searchInput.addEventListener('input', () => {
            filterTiles(data.blogs);
        });
        
        // Initialize filtering
        filterTiles(data.blogs);
        
        // Initialize staggered animation
        initTilesAnimation();
    }

    // Initialize animations for page elements
    function initAnimations() {
        // Smooth scroll for navigation and scroll indicator
        document.querySelector('.scroll-indicator').addEventListener('click', function() {
            const blogSection = document.querySelector('.blog-section');
            blogSection.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Create particles for brain animation in hero
        createBrainParticles();
        
        // Initialize scroll animations
        initScrollAnimations();
    }
    
    // Create floating particles for the brain background
    function createBrainParticles() {
        const brainBg = document.querySelector('.brain-bg');
        if (!brainBg) return;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'data-flow';
            
            // Random positioning
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            
            particle.style.top = `${top}%`;
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            brainBg.appendChild(particle);
        }
    }
    
    // Initialize scroll-based animations
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe sections
        document.querySelectorAll('.blog-section, .cta-banner').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Initialize staggered animation for blog tiles
    function initTilesAnimation() {
        const blogTileObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add delay based on position
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, 100 * (index % 9)); // Stagger effect based on position
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        // Observe all blog tiles
        document.querySelectorAll('.blog-tile').forEach(tile => {
            blogTileObserver.observe(tile);
        });
    }

    // Populate filter categories
    function populateFilters(categories, filtersContainer) {
        filtersContainer.innerHTML = '';
        
        categories.forEach(category => {
            const filterElement = document.createElement('div');
            filterElement.className = 'blog-filter';
            if (category === 'All') filterElement.classList.add('active');
            filterElement.textContent = category;
            
            // Add animation delay for staggered appearance
            filterElement.style.animation = 'fadeIn 0.5s ease forwards';
            filterElement.style.animationDelay = `${categories.indexOf(category) * 0.1}s`;
            filterElement.style.opacity = '0';
            
            filtersContainer.appendChild(filterElement);
        });
    }

    // Add event listeners to filters
    function addFilterListeners(filtersContainer, blogs) {
        const filters = filtersContainer.querySelectorAll('.blog-filter');
        
        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Update active filter
                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                // Apply filter with animation
                filterTiles(blogs, true);
            });
        });
    }

    /* Update this JavaScript function in your blog_scripts.js file */

    // Render blog tiles based on data - updated function
    function renderBlogTiles(blogs, tilesContainer) {
        tilesContainer.innerHTML = '';
        
        blogs.forEach((blog, index) => {
            // Format date
            const dateObj = new Date(blog.created_date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Get icon SVG based on category
            const iconSvg = getIconForCategory(blog.category);
            
            const tileElement = document.createElement('a');
            tileElement.href = blog.html_page + '?id=' + blog.id + '&title=' + encodeURIComponent(blog.title) + '&category=' + encodeURIComponent(blog.category);
            tileElement.className = 'blog-tile';
            tileElement.setAttribute('data-category', blog.category);
            tileElement.setAttribute('data-id', blog.id);
            tileElement.style.transitionDelay = `${index * 0.05}s`;
            
            // Create category class name (remove spaces and make hyphenated)
            const categoryClassName = blog.category.replace(/\s+/g, '-');
            
            tileElement.innerHTML = `
                <div class="tile-category ${categoryClassName}">${blog.category}</div>
                <div class="tile-id">${blog.id}</div>
                <div class="category-icon">
                    ${iconSvg}
                </div>
                <h3>${blog.title}</h3>
                <p>${blog.description || ''}</p>
                <div class="tile-date">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    ${formattedDate}
                </div>
            `;
            
            // Add lighting effect for the icon
            addLightingEffect(tileElement);
            
            tilesContainer.appendChild(tileElement);
        });
    }
    



    // Filter blog tiles by category and search term with animation
    function filterTiles(blogs, animate = false) {
        const activeFilter = document.querySelector('.blog-filter.active').textContent;
        const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
        const blogTiles = document.querySelectorAll('.blog-tile');
        
        let visibleCount = 0;
        let visibleTiles = [];
        
        blogTiles.forEach(tile => {
            const category = tile.getAttribute('data-category');
            const title = tile.querySelector('h3').textContent.toLowerCase();
            const id = tile.getAttribute('data-id').toLowerCase();
            const description = tile.querySelector('p') ? 
                                tile.querySelector('p').textContent.toLowerCase() : '';
            
            const matchesCategory = activeFilter === 'All' || category === activeFilter;
            const matchesSearch = searchTerm === '' || 
                                title.includes(searchTerm) || 
                                id.includes(searchTerm) ||
                                description.includes(searchTerm);
            
            const isVisible = matchesCategory && matchesSearch;
            
            if (animate) {
                // Apply animation for filtering
                if (isVisible) {
                    // Reset and then fade in
                    tile.style.opacity = '0';
                    tile.style.transform = 'translateY(20px)';
                    
                    visibleTiles.push(tile);
                    visibleCount++;
                } else {
                    // Fade out
                    tile.style.opacity = '0';
                    tile.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        tile.style.display = 'none';
                    }, 300);
                }
            } else {
                // Simple display toggle
                tile.style.display = isVisible ? 'block' : 'none';
                if (isVisible) visibleCount++;
            }
        });
        
        // Apply staggered animation to visible tiles
        if (animate && visibleTiles.length > 0) {
            visibleTiles.forEach((tile, index) => {
                setTimeout(() => {
                    tile.style.display = 'block';
                    setTimeout(() => {
                        tile.style.opacity = '1';
                        tile.style.transform = 'translateY(0)';
                    }, 20); // Small delay to ensure display change is applied first
                }, index * 50); // Staggered delay
            });
        }
        
        // Show no results message if needed
        const tilesContainer = document.getElementById('blog-tiles');
        const noResultsElement = document.querySelector('.no-results-message');
        
        if (visibleCount === 0) {
            if (!noResultsElement) {
                const noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results-message';
                noResultsMessage.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7b7b9d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <p style="font-size: 1.2rem; color: #444466; margin-bottom: 10px;">No matching articles found</p>
                    <p style="color: #7b7b9d;">Try adjusting your search or filter criteria</p>
                `;
                
                if (animate) {
                    noResultsMessage.style.opacity = '0';
                    tilesContainer.appendChild(noResultsMessage);
                    setTimeout(() => {
                        noResultsMessage.style.opacity = '1';
                    }, 300);
                } else {
                    tilesContainer.appendChild(noResultsMessage);
                }
            }
        } else if (noResultsElement) {
            if (animate) {
                noResultsElement.style.opacity = '0';
                setTimeout(() => {
                    noResultsElement.remove();
                }, 300);
            } else {
                noResultsElement.remove();
            }
        }
    }

    // Helper function to get SVG icon based on category
    function getIconForCategory(category) {
        // Map categories to appropriate icons
        const categoryIcons = {
            'AI Strategy': 'star',
            'Implementation': 'tool',
            'Case Studies': 'message-square',
            'Technical Papers': 'activity',
            'Industry': 'inbox'
        };
        
        const iconName = categoryIcons[category] || 'help-circle'; // Default to help-circle
        return getIconSvg(iconName);
    }

    // Helper function to get SVG icon based on icon name
    function getIconSvg(iconName) {
        const icons = {
            'star': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>',
            'activity': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>',
            'info': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
            'message-square': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
            'tool': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
            'inbox': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
            'credit-card': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
            'shield': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
            'coffee': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
            'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
            'help-circle': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        };
        
        return icons[iconName] || icons['help-circle']; // Default to help-circle if icon not found
    }

    // Add lighting effect to the blog tile icons
    function addLightingEffect(tileElement) {
        const iconElement = tileElement.querySelector('.category-icon');
        
        if (!iconElement) return;
        
        // Add the lighting effect elements
        const lightElement = document.createElement('div');
        lightElement.className = 'icon-light';
        
        iconElement.style.position = 'relative';
        iconElement.style.overflow = 'hidden';
        iconElement.appendChild(lightElement);
        
        // Add particles for enhanced effect
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'icon-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(138, 76, 246, 0.6);
                border-radius: 50%;
                opacity: 0;
                transform: translate(-50%, -50%);
                z-index: 0;
            `;
            
            // Random positioning
            const angle = Math.random() * Math.PI * 2;
            const distance = 10 + Math.random() * 20;
            const x = Math.cos(angle) * distance + 50;
            const y = Math.sin(angle) * distance + 50;
            
            particle.style.left = x + '%';
            particle.style.top = y + '%';
            
            iconElement.appendChild(particle);
        }
        
        // Event listeners for hover animation
        tileElement.addEventListener('mouseenter', function() {
            const light = this.querySelector('.icon-light');
            const particles = this.querySelectorAll('.icon-particle');
            
            if (light) {
                light.style.opacity = '1';
                light.style.transform = 'scale(1)';
                light.style.animation = 'pulse 2s infinite';
            }
            
            particles.forEach((particle, index) => {
                setTimeout(() => {
                    particle.style.opacity = '1';
                    particle.style.transition = 'all 0.5s ease';
                    
                    // Random animation
                    const animDuration = 1 + Math.random() * 2;
                    const animDelay = Math.random() * 0.5;
                    
                    particle.style.animation = `particleMove ${animDuration}s infinite ${animDelay}s`;
                }, index * 100);
            });
        });
        
        tileElement.addEventListener('mouseleave', function() {
            const light = this.querySelector('.icon-light');
            const particles = this.querySelectorAll('.icon-particle');
            
            if (light) {
                light.style.opacity = '0';
                light.style.transform = 'scale(0.3)';
                light.style.animation = 'none';
            }
            
            particles.forEach(particle => {
                particle.style.opacity = '0';
                particle.style.animation = 'none';
            });
        });
    }

    // Handle newsletter form submission
    const newsletterForm = document.querySelector('.blog-newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.blog-newsletter-input');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Success state
                this.innerHTML = `
                    <div style="text-align: center; padding: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 10px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <p style="font-size: 1.1rem; color: white; margin-bottom: 5px;">Thank you for subscribing!</p>
                        <p style="color: rgba(255, 255, 255, 0.8);">You'll receive notifications about our latest insights.</p>
                    </div>
                `;
            } else {
                // Show validation error
                emailInput.style.borderColor = '#ff4757';
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'newsletter-error';
                errorMessage.textContent = 'Please enter a valid email address';
                errorMessage.style.cssText = `
                    color: white;
                    font-size: 0.8rem;
                    margin-top: 5px;
                    text-align: left;
                    padding-left: 20px;
                `;
                
                // Remove any existing error message
                const existingError = newsletterForm.querySelector('.newsletter-error');
                if (existingError) {
                    existingError.remove();
                }
                
                emailInput.parentNode.insertBefore(errorMessage, emailInput.nextSibling);
                
                // Focus the input field
                emailInput.focus();
            }
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
