const Marzipan = artifacts.require('CakeToken');
const MasterChef = artifacts.require('MasterChef');

module.exports = async function (callback) {
  const marzipan = await Marzipan.deployed();
  const chef = await MasterChef.deployed();

  const [from] = await web3.eth.getAccounts();

  await marzipan.approve(chef.address, web3.utils.toWei('10'), { from });
  console.log('Approved', 10);

  try {
    await chef.enterStaking(web3.utils.toWei('9'), { from });
    console.log('Staked', 9);
  } catch (e) {
    console.log(e);
  }

  callback();
};
