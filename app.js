// Check for Ethereum provider and initialize web3
if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
            console.log('Ethereum enabled.');
            load();
        })
        .catch((err) => console.error('User denied account access', err));
} else {
    alert('No Ethereum browser extension detected. Please install MetaMask or similar.');
}

// Contract details
const contractAddress = '0x9dd23a28128A1a0F2D677A3768F317Bf2f909E2B';
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);
let lastTransactionTimestamp = 0;

async function load() {
    try {
        const accounts = await web3.eth.getAccounts();
        const totalSupply = await contract.methods.totalSupply().call();
        const balance = await contract.methods.balanceOf(accounts[0]).call();

        document.getElementById('totalSupply').innerText = totalSupply;
        document.getElementById('balance').innerText = balance;
    } catch (error) {
        console.error('Error loading contract data:', error);
    }
}

async function transferTokens() {
    try {
        const accounts = await web3.eth.getAccounts();
        const recipient = document.getElementById('recipient').value;
        const amount = document.getElementById('amount').value;

        if (!web3.utils.isAddress(recipient)) {
            alert('Invalid recipient address.');
            return;
        }

        if (amount <= 0) {
            alert('Amount must be greater than zero.');
            return;
        }

        const startTime = new Date().getTime();
        await contract.methods.transfer(recipient, amount).send({ from: accounts[0] });
        const endTime = new Date().getTime();

        lastTransactionTimestamp = endTime - startTime;
        document.getElementById('lastTransactionDuration').innerText = lastTransactionTimestamp + ' ms';

        load(); 
    } catch (error) {
        console.error('Transaction failed:', error);
        alert('Transaction failed. Please try again.');
    }
}

window.onload = load;
