const { tokens, ubeswap } = require('../addresses');
const UniswapRouter = require('../abis/UniswapFactory.json');

const MasterChef = artifacts.require('MasterChef');
const Marzipan = artifacts.require('CakeToken');

module.exports = async function (deployer) {
  const chef = await MasterChef.deployed();
  const marzipan = await Marzipan.deployed();

  const factory = new web3.eth.Contract(
    UniswapRouter,
    ubeswap[deployer.network_id].factory
  );

  const MZPN = marzipan.address;

  for (const { allocPoints, token } of [
    { allocPoints: 700, token: tokens[deployer.network_id].CELO },
    { allocPoints: 300, token: tokens[deployer.network_id].cUSD },
    { allocPoints: 300, token: tokens[deployer.network_id].cEUR },
  ]) {
    const lp = await factory.methods.getPair(token, MZPN).call();
    await chef.add(allocPoints, lp, true, {
      from: deployer.provider.addresses[0],
    });
  }
};
