const { tokens, ubeswap } = require('../addresses');
const UniswapRouter = require('../abis/UniswapFactory.json');

const MasterChef = artifacts.require('MasterChef');
const Marzipan = artifacts.require('CakeToken');

module.exports = async function (deployer) {
  const chef = await MasterChef.deployed();
  const marzipan = await Marzipan.deployed();

  const [from] = await web3.eth.getAccounts();
  const networkId = await web3.eth.getChainId();

  const factory = new web3.eth.Contract(
    UniswapRouter,
    ubeswap[networkId].factory
  );

  for (const { allocPoints, token } of [
    { allocPoints: 300, token: tokens[networkId].CELO },
    { allocPoints: 200, token: tokens[networkId].cUSD },
    { allocPoints: 100, token: tokens[networkId].cEUR },
  ]) {
    const lp = await factory.methods.getPair(token, marzipan.address).call();
    await chef.add(allocPoints, lp, true, {
      from,
    });
  }
};
