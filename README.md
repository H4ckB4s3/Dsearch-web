# Dsearch Web Application

## Introduction
The Dsearch Web Application provides a simple and efficient way to resolve web3 domains using web2 bridges. It supports ENS (Ethereum Name Service) and HNS (Handshake) domains, making it easy to access these decentralized domains through your web browser.

## Features
- Input field to resolve ENS and HNS domains
- Automatically uses `hns.to` for HNS domains and `limo.eth` for ENS domains
- Opens resolved domains in a new browser tab
- Checks the availability of the bridges (`hns.to` and `limo.eth`) on page load

## Installation
To use the Dsearch Web Application, visit [https://dsearch.org](https://dsearch.org) and follow the instructions provided on the website.

## Usage
1. Navigate to [https://dsearch.org](https://dsearch.org) in your web browser.
2. Enter an ENS or HNS domain in the input field. 
   - You do not need to type `https://` or `http://`, nor a leading dot (`.`). 
   - The application will automatically resolve top-level domains (TLDs), second-level domains (SLDs), and third-level domains.
3. Click the "Go" button to resolve the domain. The resolved URL will open in a new browser tab.

## Code Overview

### HTML Structure
The application consists of a simple HTML structure with an input field and a button.

### JavaScript Functionality
The JavaScript code handles the domain resolution logic and UI interactions.

#### Domain Resolution
The script listens for the button click, processes the input, and constructs the appropriate URL based on the domain type.

#### Checking Bridge Availability
The script checks if the `hns.to` and `limo.eth` bridges are online and updates the UI indicators accordingly.

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Contributing
We welcome contributions from the community. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with a clear description.
4. Push your branch to your forked repository.
5. Open a pull request to the main repository.

## Contact
For any questions or support, please reach out to us at [info@dsearch.org](mailto:info@dsearch.org).
