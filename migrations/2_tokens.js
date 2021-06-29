const Marzipan = artifacts.require('CakeToken');
const Fudge = artifacts.require('SyrupBar');

module.exports = async function (deployer) {
  await deployer.deploy(Marzipan);
  await deployer.deploy(Fudge, Marzipan.address);
};
