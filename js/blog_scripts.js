/* blog_scripts.js - Enhanced with additional animations (continued) */

document.addEventListener('DOMContentLoaded', function() {
    // ... previous code ...
    
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
    
    // Add CSS for enhanced glow effects
    function addEnhancedGlowStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Glow wrapper around each tile */
            .glow-wrapper {
                position: relative;
                border-radius: 15px;
                overflow: visible;
                margin-bottom: 15px;
            }

            /* The actual glow effect */
            .tile-glow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 15px;
                background: radial-gradient(
                    circle at center,
                    rgba(66, 84, 255, 0.3) 0%,
                    rgba(80, 220, 100, 0.1) 30%,
                    rgba(0, 0, 0, 0) 70%
                );
                opacity: 0;
                z-index: -1;
                transform: scale(1.05);
                filter: blur(8px);
                animation: tileGlowPulse 4s ease-in-out infinite alternate;
            }

            /* Alternative glow for odd-numbered tiles */
            .glow-wrapper:nth-child(odd) .tile-glow {
                background: radial-gradient(
                    circle at center,
                    rgba(80, 220, 100, 0.3) 0%,
                    rgba(66, 84, 255, 0.1) 30%,
                    rgba(0, 0, 0, 0) 70%
                );
                animation-delay: 2s;
            }
            
            /* Brain glow and particle effects */
            .brain-glow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 5px;
                background: radial-gradient(
                    circle at center,
                    rgba(66, 84, 255, 0.4) 0%,
                    rgba(80, 220, 100, 0.2) 30%,
                    rgba(0, 0, 0, 0) 70%
                );
                filter: blur(15px);
                opacity: 0.4;
                z-index: -1;
                animation: brainGlowPulse 5s ease-in-out infinite alternate;
            }
            
            .brain-particle {
                position: absolute;
                width: 3px;
                height: 3px;
                border-radius: 50%;
                filter: blur(1px);
                opacity: 0;
                z-index: 0;
            }
            
            /* Enhanced hover effect on tiles */
            .blog-tile:hover + .tile-glow {
                opacity: 1;
                animation: none;
                transform: scale(1.2);
            }
            
            /* Enhanced category icon glow */
            .category-icon {
                box-shadow: 0 0 15px rgba(66, 84, 255, 0.2);
            }
            
            .blog-tile:hover .category-icon {
                box-shadow: 0 0 20px rgba(66, 84, 255, 0.5);
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Call this right after DOM is loaded to ensure styles are applied early
    addEnhancedGlowStyles();
    
    // Function to create a pulsating brain background
    function createPulsatingBrainBackground() {
        const mainContent = document.querySelector('#main-content');
        if (!mainContent) return;
        
        // Create a background container
        const bgContainer = document.createElement('div');
        bgContainer.className = 'bg-neuron-container';
        bgContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
            opacity: 0.03;
        `;
        
        // Add connection lines
        for (let i = 0; i < 15; i++) {
            const line = document.createElement('div');
            line.className = 'neuron-connection';
            
            // Random positioning and styling
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = startX + (Math.random() * 40 - 20);
            const endY = startY + (Math.random() * 40 - 20);
            const width = 1 + Math.random() * 2;
            
            line.style.cssText = `
                position: absolute;
                top: ${startY}%;
                left: ${startX}%;
                width: ${width}px;
                height: ${Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))}px;
                background: linear-gradient(to bottom, rgba(66, 84, 255, 0.7), rgba(80, 220, 100, 0.7));
                transform: rotate(${Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}deg);
                transform-origin: top left;
                opacity: ${0.3 + Math.random() * 0.7};
                animation: connectionPulse ${3 + Math.random() * 5}s infinite alternate;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            bgContainer.appendChild(line);
        }
        
        // Add neuron nodes
        for (let i = 0; i < 10; i++) {
            const node = document.createElement('div');
            node.className = 'neuron-node';
            
            // Random positioning and styling
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = 5 + Math.random() * 10;
            
            node.style.cssText = `
                position: absolute;
                top: ${y}%;
                left: ${x}%;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(66, 84, 255, 0.8), rgba(80, 220, 100, 0.8));
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(66, 84, 255, 0.5);
                opacity: ${0.3 + Math.random() * 0.7};
                animation: nodePulse ${3 + Math.random() * 5}s infinite alternate;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            bgContainer.appendChild(node);
        }
        
        // Add keyframes for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes connectionPulse {
                0% {
                    opacity: 0.1;
                }
                100% {
                    opacity: 0.6;
                }
            }
            
            @keyframes nodePulse {
                0% {
                    transform: scale(0.8);
                    opacity: 0.2;
                }
                100% {
                    transform: scale(1.2);
                    opacity: 0.7;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Insert at the beginning of the main content
        mainContent.style.position = 'relative';
        mainContent.insertBefore(bgContainer, mainContent.firstChild);
    }
    
    // Call this function after the page has loaded
    setTimeout(createPulsatingBrainBackground, 1000);
});
