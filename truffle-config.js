require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    alfajores: {
      network_id: '44787',
      skipDryRun: true,
      provider: () => {
        const provider = new HDWalletProvider({
          privateKeys: [process.env.PRIVATE_KEY],
          addressIndex: 0,
          numberOfAddresses: 1,
          providerOrUrl: 'https://alfajores-forno.celo-testnet.org',
        });
        return provider;
      },
    },
    mainnet: {
      host: 'https://forno.celo.org',
      network_id: '*',
    },
  },
  compilers: {
    solc: {
      version: '0.6.12',
    },
  },
};
