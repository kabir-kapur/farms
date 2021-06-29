const Marzipan = artifacts.require('CakeToken');
const MasterChef = artifacts.require('MasterChef');

module.exports = async function (callback) {
  const marzipan = await Marzipan.deployed();
  const masterChef = await MasterChef.deployed();

  const [from] = await web3.eth.getAccounts();
  await marzipan.transfer(masterChef.address, web3.utils.toWei('1'), { from });

  callback();
};
