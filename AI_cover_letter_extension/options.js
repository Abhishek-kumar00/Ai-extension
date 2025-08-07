// options.js

// Function to save options to chrome.storage
function save_options() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const skills = document.getElementById('skills').value;
  const projects = document.getElementById('projects').value;
  const experience = document.getElementById('experience').value;
  const colabUrl = document.getElementById('colabUrl').value;

  chrome.storage.local.set({
    name: name,
    email: email,
    phone: phone,
    skills: skills,
    projects: projects,
    experience: experience,
    colabUrl: colabUrl
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get({
    name: '',
    email: '',
    phone: '',
    skills: '',
    projects: '',
    experience: '',
    colabUrl: ''
  }, function(items) {
    document.getElementById('name').value = items.name;
    document.getElementById('email').value = items.email;
    document.getElementById('phone').value = items.phone;
    document.getElementById('skills').value = items.skills;
    document.getElementById('projects').value = items.projects;
    document.getElementById('experience').value = items.experience;
    document.getElementById('colabUrl').value = items.colabUrl;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
