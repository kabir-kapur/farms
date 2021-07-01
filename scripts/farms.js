const { tokens, ubeswap } = require('../addresses');
const UniswapRouter = require('../abis/UniswapFactory.json');

const MasterChef = artifacts.require('MasterChef');
const Marzipan = artifacts.require('CakeToken');

module.exports = async function (callback) {
  const chef = await MasterChef.deployed();
  const marzipan = await Marzipan.deployed();

  const [from] = await web3.eth.getAccounts();
  const networkId = await web3.eth.getChainId();

  const factory = new web3.eth.Contract(
    UniswapRouter,
    ubeswap[networkId].factory
  );

  const length = (await chef.poolLength()).toNumber();
  console.log('Pool length', length);

  const farms = [
    { allocPoints: 300, token: tokens[networkId].CELO },
    { allocPoints: 200, token: tokens[networkId].cUSD },
    { allocPoints: 100, token: tokens[networkId].cEUR },
  ];
  for (let i = length - 1; i < farms.length; i++) {
    const { allocPoints, token } = farms[i];
    const lp = await factory.methods.getPair(token, marzipan.address).call();
    console.log('Add', i, `(${lp})`);
    await chef.add(allocPoints, lp, false, {
      from,
    });
    console.log('Added');
  }

  const lp = await factory.methods
    .getPair(tokens[networkId].CELO, tokens[networkId].cUSD)
    .call();
  await chef.add(100, lp, false, {
    from,
  });
  console.log('Added CELO <> cUSD farm');

  console.log('massUpdatePools');
  try {
    await chef.massUpdatePools({
      from,
    });
    console.log('massUpdatePools complete');
  } catch (e) {
    console.log(e.message);
  }

  callback();
};
