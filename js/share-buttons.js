/**
 * Social Share Buttons Functionality
 * This standalone script handles social media sharing for blog articles
 */

// Initialize social sharing functionality
(function() {
    // Function to initialize share buttons
    function initShareButtons() {
        console.log('Initializing share buttons...');
        const shareButtons = document.querySelectorAll('.blog-share-link');
        
        if (shareButtons.length > 0) {
            console.log('Found ' + shareButtons.length + ' share buttons');
            
            shareButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Share button clicked: ' + this.getAttribute('data-platform'));
                    
                    // Get current page URL and title
                    const shareUrl = encodeURIComponent(window.location.href);
                    const shareTitle = encodeURIComponent(document.title);
                    
                    // Determine which platform was clicked
                    const platform = this.getAttribute('data-platform');
                    let shareLink = '';
                    
                    switch(platform) {
                        case 'facebook':
                            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                            break;
                        case 'twitter':
                            shareLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
                            break;
                        case 'linkedin':
                            shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
                            break;
                        case 'generic':
                            // For copy to clipboard
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(window.location.href).then(() => {
                                    alert('Link copied to clipboard!');
                                }).catch(err => {
                                    console.error('Could not copy link: ', err);
                                    prompt('Copy this link:', window.location.href);
                                });
                            } else {
                                // Fallback for browsers that don't support clipboard API
                                prompt('Copy this link:', window.location.href);
                            }
                            return;
                        default:
                            return;
                    }
                    
                    // Open share dialog in a popup window
                    window.open(shareLink, 'Share', 'width=600,height=400,resizable=yes,scrollbars=yes');
                });
                
                // Add cursor pointer style directly
                button.style.cursor = 'pointer';
            });
        } else {
            console.warn('No share buttons found on page');
        }
    }

    // Call immediately and also when DOM is fully loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initShareButtons();
    } else {
        document.addEventListener('DOMContentLoaded', initShareButtons);
    }
    
    // Additional call after a delay to ensure everything is loaded
    setTimeout(initShareButtons, 1000);
})();
