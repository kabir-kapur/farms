const Fudge = artifacts.require('SyrupBar');
const SousChef = artifacts.require('SousChef');

module.exports = async function (deployer) {
  const fudge = await Fudge.deployed();
  await deployer.deploy(SousChef, fudge.address, 100, 5918926, 6000000);
};
