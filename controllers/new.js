import { Web3 } from "web3";
//const bip39 = require('bip39');
const EvmContractAbi = [
  {
     inputs: [],
     stateMutability: 'nonpayable',
     type: 'constructor',
  },
  {
     anonymous: false,
     inputs: [
        {
           indexed: true,
           internalType: 'address',
           name: 'owner',
           type: 'address',
        },
        {
           indexed: true,
           internalType: 'address',
           name: 'approved',
           type: 'address',
        },
        {
           indexed: true,
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'Approval',
     type: 'event',
  },
  {
     anonymous: false,
     inputs: [
        {
           indexed: true,
           internalType: 'address',
           name: 'owner',
           type: 'address',
        },
        {
           indexed: true,
           internalType: 'address',
           name: 'operator',
           type: 'address',
        },
        {
           indexed: false,
           internalType: 'bool',
           name: 'approved',
           type: 'bool',
        },
     ],
     name: 'ApprovalForAll',
     type: 'event',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'to',
           type: 'address',
        },
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'approve',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     anonymous: false,
     inputs: [
        {
           indexed: false,
           internalType: 'uint256',
           name: '_fromTokenId',
           type: 'uint256',
        },
        {
           indexed: false,
           internalType: 'uint256',
           name: '_toTokenId',
           type: 'uint256',
        },
     ],
     name: 'BatchMetadataUpdate',
     type: 'event',
  },
  {
     inputs: [
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'burn',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     anonymous: false,
     inputs: [
        {
           indexed: false,
           internalType: 'uint256',
           name: '_tokenId',
           type: 'uint256',
        },
     ],
     name: 'MetadataUpdate',
     type: 'event',
  },
  {
     anonymous: false,
     inputs: [
        {
           indexed: true,
           internalType: 'address',
           name: 'previousOwner',
           type: 'address',
        },
        {
           indexed: true,
           internalType: 'address',
           name: 'newOwner',
           type: 'address',
        },
     ],
     name: 'OwnershipTransferred',
     type: 'event',
  },
  {
     inputs: [],
     name: 'renounceOwnership',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'to',
           type: 'address',
        },
        {
           internalType: 'string',
           name: 'uri',
           type: 'string',
        },
     ],
     name: 'safeMintByManager',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'to',
           type: 'address',
        },
        {
           internalType: 'string',
           name: 'uri',
           type: 'string',
        },
     ],
     name: 'safeMintByUser',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'from',
           type: 'address',
        },
        {
           internalType: 'address',
           name: 'to',
           type: 'address',
        },
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'safeTransferFrom',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'from',
           type: 'address',
        },
        {
           internalType: 'address',
           name: 'to',
           type: 'address',
        },
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
        {
           internalType: 'bytes',
           name: 'data',
           type: 'bytes',
        },
     ],
     name: 'safeTransferFrom',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'from',
           type: 'address',
        },
        {
           internalType: 'address',
           name: 'to',
           type: 'address',
        },
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'safeTransferFromByManager',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'operator',
           type: 'address',
        },
        {
           internalType: 'bool',
           name: 'approved',
           type: 'bool',
        },
     ],
     name: 'setApprovalForAll',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     anonymous: false,
     inputs: [
        {
           indexed: true,
           internalType: 'address',
           name: 'from',
           type: 'address',
        },
        {
           indexed: true,
           internalType: 'address',
           name: 'to',
           type: 'address',
        },
        {
           indexed: true,
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'Transfer',
     type: 'event',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'from',
           type: 'address',
        },
        {
           internalType: 'address',
           name: 'to',
           type: 'address',
        },
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'transferFrom',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'newOwner',
           type: 'address',
        },
     ],
     name: 'transferOwnership',
     outputs: [],
     stateMutability: 'nonpayable',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'owner',
           type: 'address',
        },
     ],
     name: 'balanceOf',
     outputs: [
        {
           internalType: 'uint256',
           name: '',
           type: 'uint256',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'getApproved',
     outputs: [
        {
           internalType: 'address',
           name: '',
           type: 'address',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'address',
           name: 'owner',
           type: 'address',
        },
        {
           internalType: 'address',
           name: 'operator',
           type: 'address',
        },
     ],
     name: 'isApprovedForAll',
     outputs: [
        {
           internalType: 'bool',
           name: '',
           type: 'bool',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
  {
     inputs: [],
     name: 'name',
     outputs: [
        {
           internalType: 'string',
           name: '',
           type: 'string',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
  {
     inputs: [],
     name: 'owner',
     outputs: [
        {
           internalType: 'address',
           name: '',
           type: 'address',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'ownerOf',
     outputs: [
        {
           internalType: 'address',
           name: '',
           type: 'address',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'bytes4',
           name: 'interfaceId',
           type: 'bytes4',
        },
     ],
     name: 'supportsInterface',
     outputs: [
        {
           internalType: 'bool',
           name: '',
           type: 'bool',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
  {
     inputs: [],
     name: 'symbol',
     outputs: [
        {
           internalType: 'string',
           name: '',
           type: 'string',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
  {
     inputs: [
        {
           internalType: 'uint256',
           name: 'tokenId',
           type: 'uint256',
        },
     ],
     name: 'tokenURI',
     outputs: [
        {
           internalType: 'string',
           name: '',
           type: 'string',
        },
     ],
     stateMutability: 'view',
     type: 'function',
  },
];

const web3 = new Web3(`ws://54.153.79.64:9944`);
const contract = new web3.eth.Contract(
  EvmContractAbi,
  "0xdc210C082FD4D032a0fEBFb9e83Cd042F916836D"
);
console.log("contract",contract. methods);

const contractfunc = async () => {
  console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
  
  const getBalance = await contract.methods
    .balanceOf('0x46258A596DD67C86f01e9Bfc4D961c463C1959E5');
  console.log("getBalance ==>>", getBalance);
};
contractfunc();
