// Initialize newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.blog-newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.blog-newsletter-input');
            const email = emailInput.value.trim();
            const submitButton = this.querySelector('.blog-newsletter-button');
            
            // Validate email
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Change button state
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            // Create FormData object
            const formData = new FormData();
            formData.append('email', email);
            formData.append('_subject', 'New Newsletter Subscription');
            formData.append('subscription_type', 'Newsletter');
            
            // Send to Formspree - USE THE SAME FORMSPREE ENDPOINT AS YOUR CONTACT FORM
            fetch("https://formspree.io/f/xeogajkz", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success!
                    alert('Thank you for subscribing to our newsletter!');
                    
                    // Clear form field
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
    }
});

// Email validation function (same as the one in contact form)
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
