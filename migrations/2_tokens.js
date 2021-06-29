const Tiramisu = artifacts.require('CakeToken');
const Fudge = artifacts.require('SyrupBar');

module.exports = async function (deployer) {
  await deployer.deploy(Tiramisu);
  await deployer.deploy(Fudge, Tiramisu.address);
};
