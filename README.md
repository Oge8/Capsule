# Decentralized Time Capsule Network

## Description

The Decentralized Time Capsule Network is a blockchain-based platform that allows users to store encrypted data that can only be accessed after a specific future block height or date. This innovative project combines personal digital legacy with blockchain immutability, creating a secure and transparent way to preserve information for future generations.

## Features

- Store encrypted messages, multimedia files, or even NFTs on the blockchain
- Time-lock mechanism ensures data can only be accessed after a specified time
- Option for public or user-specific unlocking
- Utilizes blockchain technology for immutability and transparency
- Potential for zero-knowledge proofs for secret messages (future development)

## Use Cases

1. **Personal Legacy**: Individuals can leave personal messages or cultural artifacts for future generations.
2. **Corporate Transparency**: Companies can commit to long-term transparency by time-locking important documents or data.
3. **Government Archives**: Governmental bodies can use the platform for secure, time-based release of sensitive information.
4. **Cultural Preservation**: Artists and cultural institutions can preserve digital artifacts with guaranteed future accessibility.
5. **Time-Locked Rewards**: Organizations can create time-locked incentives or rewards for long-term participation or achievement.

## Smart Contract Overview

The core of the Decentralized Time Capsule Network is a Clarity smart contract deployed on the Stacks blockchain. Here are the main functions:

- `create-time-capsule`: Allows users to create a new time capsule with content and a lock duration.
- `reveal-capsule`: Enables the owner to reveal a capsule after the lock period has expired.
- `get-capsule`: Retrieves capsule information if it has been revealed.
- `get-capsule-count`: Returns the total number of capsules created.

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) installed for local development and testing
- Basic knowledge of Clarity and Stacks blockchain

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/decentralized-time-capsule.git
   cd decentralized-time-capsule
   ```

2. Install dependencies:
   ```
   clarinet requirements
   ```

3. Run tests:
   ```
   clarinet test
   ```

### Usage

1. Deploy the smart contract to the Stacks blockchain (testnet or mainnet).
2. Interact with the contract using a Stacks wallet or through your application's backend.

Example of creating a time capsule:
```clarity
(contract-call? .time-capsule create-time-capsule "Hello, future!" u100)
```

This creates a time capsule with the message "Hello, future!" that will be locked for 100 blocks.

## Future Developments

- Implementation of zero-knowledge proofs for secret messages
- Integration with IPFS for storing larger files
- Mobile app for easy capsule creation and management
- Multi-sig functionality for corporate or institutional use

## Contributing

We welcome contributions to the Decentralized Time Capsule Network! Please read our CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.


## Acknowledgments

- Thanks to the Stacks community for their support and resources


## Author

Ogechi Obidile

---

Join us in preserving the present for the future with the Decentralized Time Capsule Network!