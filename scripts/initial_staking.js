const Marzipan = artifacts.require('CakeToken');
const MasterChef = artifacts.require('MasterChef');

module.exports = async function (callback) {
  const marzipan = await Marzipan.deployed();
  const chef = await MasterChef.deployed();

  const [from] = await web3.eth.getAccounts();

  const amount = '100';
  const wei = web3.utils.toWei(amount);

  await marzipan.approve(chef.address, amount, { from });
  console.log('Approved', amount);

  await chef.enterStaking(wei, { from });
  console.log('Staked', amount);

  callback();
};
