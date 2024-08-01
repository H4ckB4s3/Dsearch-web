document.getElementById('hns-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let query = document.getElementById('hns-input').value.trim();

    // Remove http://, https://, or leading dots from the input
    query = query.replace(/^https?:\/\//, '').replace(/^\./, '');

    // Replace spaces with dots
    query = query.replace(/\s+/g, '.');

    if (query) {
        const parts = query.split('/');
        let domain = parts.shift();
        const path = parts.join('/');

        // Check for .eth and append .eth.limo
        const ethPattern = /\.eth$/;
        if (ethPattern.test(domain)) {
            domain += '.limo';
        } else {
            domain += '.hns.to';
        }

        // Construct the URL
        const url = path ? `http://${domain}/${path}` : `http://${domain}`;
        window.open(url, '_blank');
    }
});

// Settings menu toggle
const settingsButton = document.querySelector('.settings-button');
const settingsMenu = document.querySelector('.settings-menu');

settingsButton.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (event) => {
    if (!settingsButton.contains(event.target) && !settingsMenu.contains(event.target)) {
        settingsMenu.style.display = 'none';
    }
});

document.getElementById('hns-input').focus();
