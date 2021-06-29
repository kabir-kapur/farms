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

  console.group({
    marzipan: marzipan.address,
    fudge: fudge.address,
    masterChef: masterChef.address,
    multicall: multicall.address,
  });

  callback();
};
