const Marzipan = artifacts.require('CakeToken');
const Fudge = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');

module.exports = async function (deployer) {
  const marzipan = await Marzipan.deployed();
  const fudge = await Fudge.deployed();

  const [account] = await web3.eth.getAccounts();

  await deployer.deploy(
    MasterChef,
    marzipan.address,
    fudge.address,
    account,
    web3.utils.toWei('100'),
    5928754
  );
};
