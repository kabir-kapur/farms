const { tokens, ubeswap } = require('../addresses');
const UniswapRouter = require('../abis/UniswapFactory.json');

const MasterChef = artifacts.require('MasterChef');
const Marzipan = artifacts.require('CakeToken');

module.exports = async function (deployer) {
  const chef = await MasterChef.deployed();
  const marzipan = await Marzipan.deployed();

  const [account] = await web3.eth.getAccounts();
  const networkId = await web3.eth.getChainId();

  const factory = new web3.eth.Contract(
    UniswapRouter,
    ubeswap[networkId].factory
  );

  const MZPN = marzipan.address;

  for (const { allocPoints, token } of [
    { allocPoints: 700, token: tokens[networkId].CELO },
    { allocPoints: 300, token: tokens[networkId].cUSD },
    { allocPoints: 300, token: tokens[networkId].cEUR },
  ]) {
    const lp = await factory.methods.getPair(token, MZPN).call();
    await chef.add(allocPoints, lp, true, {
      from: account,
    });
  }
};
