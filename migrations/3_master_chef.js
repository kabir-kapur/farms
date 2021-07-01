const Marzipan = artifacts.require('CakeToken');
const Fudge = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');
const { networkIds } = require('../addresses');

module.exports = async function (deployer) {
  const marzipan = await Marzipan.deployed();
  const fudge = await Fudge.deployed();

  const [from] = await web3.eth.getAccounts();
  const networkId = await web3.eth.getChainId();

  const startBlock =
    networkId.toString() === networkIds.alfajores ? '5943532' : '7500000';
  await deployer.deploy(
    MasterChef,
    marzipan.address,
    fudge.address,
    from,
    10, // MZPN per block
    startBlock
  );

  const masterChef = await MasterChef.deployed();
  await marzipan.transferOwnership(masterChef.address, { from });
  await fudge.transferOwnership(masterChef.address, { from });
};
