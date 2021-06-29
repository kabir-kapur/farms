const Tiramisu = artifacts.require('CakeToken');
const Fudge = artifacts.require('SyrupBar');
const UniswapRouter = require('../abis/UniswapFactory.json');

module.exports = async function (callback) {
  const tiramisu = await Tiramisu.deployed();
  const fudge = await Fudge.deployed();

  const factory = new web3.eth.Contract(
    UniswapRouter,
    // https://github.com/Ubeswap/ubeswap/blob/master/deployments/exchange.alfajores.addresses.json
    '0x62d5b84be28a183abb507e125b384122d2c25fae'
  );

  const addresses = {
    44787: [
      { name: 'CELO', address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9' },
      { name: 'cUSD', address: '0x874069fa1eb16d44d622f2e0ca25eea172369bc1' },
      { name: 'cEUR', address: '0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f' },
    ],
    42220: [
      { name: 'CELO', address: '0x471ece3750da237f93b8e339c536989b8978a438' },
      { name: 'cUSD', address: '0x765de816845861e75a25fca122bb6898b8b1282a' },
      { name: 'cEUR', address: '0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73' },
    ],
  };

  const [deployer] = await web3.eth.getAccounts();
  const networkId = await web3.eth.getChainId();

  async function create(token0, token1) {
    try {
      await new Promise((resolve, reject) => {
        factory.methods
          .createPair(token0, token1)
          .send({ from: deployer })
          .on('confirmation', resolve)
          .on('error', reject);
      });
    } catch (e) {
      // exists
    }
    console.log('>>>', await factory.methods.getPair(token0, token1).call());
  }

  const networkAddresses = addresses[networkId];

  console.log('Marzipan <> Fudge');
  await create(tiramisu.address, fudge.address);

  for (const { name, address } of networkAddresses) {
    console.log(`Marzipan <> ${name}`);
    await create(tiramisu.address, address);
    console.log(`Fudge <> ${name}`);
    await create(fudge.address, address);

    for (const { name: name1, address: address1 } of networkAddresses) {
      console.log(`${name} <> ${name1}`);
      await create(address, address1);
    }
  }

  callback();
};
