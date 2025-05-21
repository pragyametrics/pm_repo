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
