const Tiramisu = artifacts.require('CakeToken');
const Fudge = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');

module.exports = async function (deployer) {
  const tiramisu = await Tiramisu.deployed();
  const fudge = await Fudge.deployed();

  await deployer.deploy(
    MasterChef,
    tiramisu.address,
    fudge.address,
    deployer.provider.addresses[0],
    100,
    0
  );
};
