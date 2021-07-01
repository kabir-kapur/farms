const Marzipan = artifacts.require('CakeToken');
const Fudge = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');
const Multicall = artifacts.require('Multicall');
const UniswapRouter = require('../abis/UniswapFactory.json');
const { tokens, ubeswap } = require('../addresses');

module.exports = async function (callback) {
  const marzipan = await Marzipan.deployed();
  const fudge = await Fudge.deployed();
  const masterChef = await MasterChef.deployed();
  const multicall = await Multicall.deployed();

  const networkId = await web3.eth.getChainId();

  console.log('Core contract addresses:');
  console.group({
    marzipan: marzipan.address,
    fudge: fudge.address,
    masterChef: masterChef.address,
    multicall: multicall.address,
  });
  console.log();

  const flat = [
    ...Object.entries(tokens[networkId]),
    ['MZPN', marzipan.address],
    ['FUDGE', fudge.address],
  ];

  const factory = new web3.eth.Contract(
    UniswapRouter,
    ubeswap[networkId].factory
  );

  const done = {};

  console.log('LP addresses:');
  for (const [ticker0, address0] of flat) {
    for (const [ticker1, address1] of flat) {
      if (ticker0 === ticker1) {
        continue;
      }

      const sorted = [address0, address1].sort().join('');
      if (done[sorted]) {
        continue;
      }

      done[sorted] = true;
      console.log(
        `${ticker0} <> ${ticker1} LP`,
        await factory.methods.getPair(address0, address1).call()
      );
    }
  }

  callback();
};
