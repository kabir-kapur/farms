const Marzipan = artifacts.require('CakeToken');
const Fudge = artifacts.require('SyrupBar');
const UniswapRouter = require('../abis/UniswapFactory.json');
const { tokens, ubeswap } = require('../addresses');

module.exports = async function (callback) {
  const marzipan = await Marzipan.deployed();
  const fudge = await Fudge.deployed();

  const [from] = await web3.eth.getAccounts();
  const networkId = await web3.eth.getChainId();

  const factory = new web3.eth.Contract(
    UniswapRouter,
    ubeswap[networkId].factory
  );

  async function create(token0, token1) {
    try {
      await new Promise((resolve, reject) =>
        factory.methods
          .createPair(token0, token1)
          .send({ from })
          .on('confirmation', resolve)
          .on('error', reject)
      );
    } catch (e) {
      // exists
    }
    console.log('>>>', await factory.methods.getPair(token0, token1).call());
  }

  console.log('Marzipan <> Fudge');
  await create(marzipan.address, fudge.address);

  for (const [name, address] of Object.entries(tokens[networkId])) {
    console.log(`Marzipan <> ${name}`);
    await create(marzipan.address, address);
    console.log(`Fudge <> ${name}`);
    await create(fudge.address, address);

    for (const [name1, address1] of Object.entries(tokens[networkId])) {
      if (name === name1) {
        continue;
      }
      console.log(`${name} <> ${name1}`);
      await create(address, address1);
    }
  }

  callback();
};
