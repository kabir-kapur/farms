require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    alfajores: {
      provider: () => {
        const provider = new HDWalletProvider({
          privateKeys: [process.env.PRIVATE_KEY],
          addressIndex: 0,
          numberOfAddresses: 1,
          providerOrUrl: 'https://alfajores-forno.celo-testnet.org',
        });
        return provider;
      },
      network_id: '44787',
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
