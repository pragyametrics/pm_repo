/**
 * Newsletter subscription functionality
 * Restored to original working version
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Find the newsletter form
    const newsletterForm = document.querySelector('.blog-newsletter-form');
    
    if (newsletterForm) {
        console.log('Newsletter form found');
        
        // Add submit event listener
        newsletterForm.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Get the email input
            const emailInput = this.querySelector('.blog-newsletter-input');
            const email = emailInput.value.trim();
            const submitButton = this.querySelector('.blog-newsletter-button');
            
            // Simple email validation
            function validateEmail(email) {
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            }
            
            // Validate email
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return false;
            }
            
            // Change button state
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            // Create FormData
            const formData = new FormData();
            formData.append('email', email);
            formData.append('_subject', 'New Newsletter Subscription');
            formData.append('subscription_type', 'Newsletter');
            
            // Send to Formspree using the same endpoint as contact form
            fetch("https://formspree.io/f/xeogajkz", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success
                    alert('Thank you for subscribing to our newsletter!');
                    
                    // Clear email field
                    emailInput.value = '';
                } else {
                    // Error
                    alert('Oops! There was a problem submitting your subscription. Please try again.');
                }
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = 'Subscribe';
            })
            .catch(error => {
                // Network error
                alert('Network error. Please check your connection and try again.');
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = 'Subscribe';
            });
        });
    } else {
        console.warn('Newsletter form not found on page');
    }
});


                  /**
 * Debug script to test form functionality
 * Add this to your page temporarily to diagnose issues
 */
console.log('Debug script loaded');

// Function to check if form exists and is properly set up
function checkForm() {
    const form = document.querySelector('.blog-newsletter-form');
    if (form) {
        console.log('Newsletter form found:', form);
        
        // Check for email input
        const emailInput = form.querySelector('.blog-newsletter-input');
        console.log('Email input found:', emailInput ? 'Yes' : 'No');
        
        // Check for submit button
        const submitButton = form.querySelector('.blog-newsletter-button');
        console.log('Submit button found:', submitButton ? 'Yes' : 'No');
        
        // Check for event listeners
        console.log('Form has event listeners attached (cannot directly check)');
        
        // Try to add a test listener
        form.addEventListener('submit', function(e) {
            console.log('TEST LISTENER: Form submit event detected');
            // Don't prevent default to see if other listeners are working
        });
        
        console.log('Test submit listener added');
    } else {
        console.error('Newsletter form NOT found on page');
        
        // Look for similar forms
        const allForms = document.querySelectorAll('form');
        console.log(`Found ${allForms.length} forms on page:`, allForms);
        
        // Look for anything with similar classes
        const similarElements = document.querySelectorAll('[class*="newsletter"], [class*="subscribe"]');
        console.log('Found elements with similar classes:', similarElements);
    }
}

// Check for script conflicts
function checkScripts() {
    const scripts = document.querySelectorAll('script');
    console.log(`Found ${scripts.length} script tags on page`);
    
    // Look for newsletter scripts
    const relevantScripts = Array.from(scripts).filter(script => 
        script.src && (script.src.includes('newsletter') || script.src.includes('blog'))
    );
    
    console.log('Potentially relevant scripts:', relevantScripts);
}

// Run checks after a slight delay to ensure DOM is fully loaded
setTimeout(() => {
    console.log('Running form checks...');
    checkForm();
    checkScripts();
    
    console.log('Try clicking this button to test form:');
    console.log('document.querySelector(".blog-newsletter-button").click()');
}, 2000);
