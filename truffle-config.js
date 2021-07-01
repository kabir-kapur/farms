require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

function getProvider(providerOrUrl) {
  return (provider = new HDWalletProvider({
    privateKeys: [process.env.PRIVATE_KEY],
    addressIndex: 0,
    numberOfAddresses: 1,
    providerOrUrl,
  }));
}

module.exports = {
  networks: {
    alfajores: {
      network_id: '44787',
      skipDryRun: true,
      provider: getProvider('https://alfajores-forno.celo-testnet.org'),
    },
    mainnet: {
      host: 'https://forno.celo.org',
      network_id: '42220',
      provider: getProvider('https://forno.celo.org'),
    },
  },
  compilers: {
    solc: {
      version: '0.6.12',
    },
  },
};
