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

        // Check if it's an .eth domain
        const ethPattern = /\.eth$/;
        if (ethPattern.test(domain)) {
            domain += '.limo';
            const url = path ? `http://${domain}/${path}` : `http://${domain}`;
            window.open(url, '_blank');
            return;
        }

        // For Handshake domains, fetch TXT records and process them
        handleHandshakeDomain(domain, path);
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

// Function to handle Handshake domain TXT record lookup and redirection
async function handleHandshakeDomain(domain, path) {
    try {
        const txtRecords = await fetchTXTRecords(domain);
        
        if (!txtRecords || txtRecords.length === 0) {
            // No TXT records found - show error message
            showError(`No TXT records found for domain: ${domain}`);
            return;
        }

        // Check for records in priority order
        let redirectPerformed = false;
        
        // 1. Check for 'link:' record
        const linkRecord = txtRecords.find(record => record.toLowerCase().startsWith('link:'));
        if (linkRecord) {
            const data = linkRecord.substring(5); // Remove 'link:' prefix
            if (data) {
                window.open(`https://${data}`, '_blank');
                redirectPerformed = true;
            }
        }
        
        // 2. Check for 'url:' record (if no link found)
        if (!redirectPerformed) {
            const urlRecord = txtRecords.find(record => record.toLowerCase().startsWith('url:'));
            if (urlRecord) {
                const data = urlRecord.substring(4); // Remove 'url:' prefix
                if (data) {
                    window.open(`https://${data}`, '_blank');
                    redirectPerformed = true;
                }
            }
        }
        
        // 3. Check for 'ipfs:' record (if no link or url found)
        if (!redirectPerformed) {
            const ipfsRecord = txtRecords.find(record => record.toLowerCase().startsWith('ipfs:'));
            if (ipfsRecord) {
                const data = ipfsRecord.substring(5); // Remove 'ipfs:' prefix
                if (data) {
                    window.open(`https://${data}.ipfs.inbrowser.link`, '_blank');
                    redirectPerformed = true;
                }
            }
        }
        
        // 4. Check for 'onion:' record (if no link, url, or ipfs found)
        if (!redirectPerformed) {
            const onionRecord = txtRecords.find(record => record.toLowerCase().startsWith('onion:'));
            if (onionRecord) {
                const data = onionRecord.substring(6); // Remove 'onion:' prefix
                if (data) {
                    window.open(`http://${data}`, '_blank');
                    redirectPerformed = true;
                }
            }
        }
        
        // 5. Check for 'nostr:' record (if no link, url, ipfs, or onion found)
        if (!redirectPerformed) {
            const nostrRecord = txtRecords.find(record => record.toLowerCase().startsWith('nostr:'));
            if (nostrRecord) {
                const data = nostrRecord.substring(6); // Remove 'nostr:' prefix
                if (data) {
                    window.open(`nostr:${data}`, '_blank');
                    redirectPerformed = true;
                }
            }
        }
        
        // 6. Check for 'ens:' record (if no link, url, ipfs, onion, or nostr found)
        if (!redirectPerformed) {
            const ensRecord = txtRecords.find(record => record.toLowerCase().startsWith('ens:'));
            if (ensRecord) {
                const data = ensRecord.substring(4); // Remove 'ens:' prefix
                if (data) {
                    window.open(`https://${data}.limo`, '_blank');
                    redirectPerformed = true;
                }
            }
        }
        
        // If no redirect was performed, show error message
        if (!redirectPerformed) {
            showError(`No valid redirect record found for domain: ${domain}. The records were checked in this order: link, url, ipfs, onion, nostr, ens`);
        }
        
    } catch (error) {
        console.error('Error fetching TXT records:', error);
        showError(`Failed to fetch TXT records for ${domain}: ${error.message}`);
    }
}

// Function to fetch TXT records for a domain
async function fetchTXTRecords(domain) {
    const url = `https://resolve.shakestation.io/dns-query?name=${domain}&type=TXT`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/dns-json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("DNS Response for", domain, ":", data);

        if (data.Answer && data.Answer.length > 0) {
            return data.Answer
                .filter(record => record.type === 16)
                .map(record => record.data.replace(/"/g, ''));
        } else {
            console.log("No TXT records found for domain:", domain);
            return [];
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
}

// Function to show error messages to the user
function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #ff4444;
        background: rgba(255, 68, 68, 0.1);
        padding: 15px;
        margin: 20px auto;
        border: 1px solid #ff4444;
        border-radius: 8px;
        max-width: 600px;
        text-align: center;
        font-weight: bold;
    `;
    errorDiv.textContent = message;
    
    // Insert error message after the form
    const form = document.getElementById('hns-form');
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    
    // Auto-remove error after 8 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 8000);
}
