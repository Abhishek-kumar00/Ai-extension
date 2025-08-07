// popup.js

// Get references to DOM elements
const generateButton = document.getElementById('generateButton');
const jobDescription = document.getElementById('jobDescription');
const resultDiv = document.getElementById('result');
const coverLetterDiv = document.getElementById('coverLetter');
const loadingDiv = document.getElementById('loading');
const copyButton = document.getElementById('copyButton');

// Add a click listener to the generate button
generateButton.addEventListener('click', () => {
    // Get the job description from the textarea
    const jobDesc = jobDescription.value;
    if (!jobDesc.trim()) {
        // Simple validation
        alert('Please paste a job description.');
        return;
    }

    // Show loading indicator and disable the button
    loadingDiv.classList.remove('hidden');
    generateButton.disabled = true;
    resultDiv.classList.add('hidden');

    // Get user data from chrome storage
    chrome.storage.local.get(['name', 'email', 'phone', 'skills', 'projects', 'experience', 'colabUrl'], (data) => {
        if (!data.colabUrl) {
            alert('Please set your Google Colab URL in the extension options.');
            loadingDiv.classList.add('hidden');
            generateButton.disabled = false;
            return;
        }

        // Prepare the data to send to the backend
        const requestData = {
            job_description: jobDesc,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
            projects: data.projects ? data.projects.split(',').map(p => p.trim()) : [],
            experience: data.experience ? data.experience.split(',').map(e => e.trim()) : [],
        };

        // Send the data to the background script to make the API call
        chrome.runtime.sendMessage({
            action: 'generateCoverLetter',
            data: requestData,
            url: data.colabUrl
        }, (response) => {
            // Hide loading indicator and re-enable the button
            loadingDiv.classList.add('hidden');
            generateButton.disabled = false;

            if (response && response.success) {
                // Display the generated cover letter
                coverLetterDiv.textContent = response.coverLetter;
                resultDiv.classList.remove('hidden');
            } else {
                // Handle errors
                const errorMessage = response ? response.error : 'An unknown error occurred.';
                alert(`Error: ${errorMessage}`);
            }
        });
    });
});

// Add click listener for the copy button
copyButton.addEventListener('click', () => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = coverLetterDiv.textContent;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
        copyButton.textContent = 'Copy to Clipboard';
    }, 2000);
});
