// background.js

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateCoverLetter') {
        const { data, url } = request;

        // Use fetch to send a POST request to your Colab backend
        fetch(`${url}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                // If response is not ok, read the error message from the body
                return response.text().then(text => { throw new Error(text || 'Network response was not ok') });
            }
            return response.json();
        })
        .then(result => {
            // Send a success response back to the popup
            sendResponse({ success: true, coverLetter: result.cover_letter });
        })
        .catch(error => {
            // Send an error response back to the popup
            console.error('Error:', error);
            sendResponse({ success: false, error: error.message });
        });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
