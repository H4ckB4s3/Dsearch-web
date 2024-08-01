        async function checkSite(url, indicatorId) {
            try {
                // Making a request to the URL
                const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });

                // Check if response is successful
                if (response.ok || response.type === 'opaque') {
                    document.getElementById(indicatorId).classList.add('green');
                    document.getElementById(indicatorId).classList.remove('red');
                } else {
                    document.getElementById(indicatorId).classList.add('red');
                    document.getElementById(indicatorId).classList.remove('green');
                }
            } catch (error) {
                document.getElementById(indicatorId).classList.add('red');
                document.getElementById(indicatorId).classList.remove('green');
            }
        }

        // Check both sites on page load
        window.onload = () => {
            checkSite('https://hns.to', 'hns-indicator');
            checkSite('https://eth.limo', 'limo-indicator');
        };
