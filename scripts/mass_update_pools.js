const MasterChef = artifacts.require('MasterChef');

module.exports = async function (callback) {
  const masterChef = await MasterChef.deployed();

  const [from] = await web3.eth.getAccounts();

  const length = (await masterChef.poolLength()).toNumber();
  for (let i = 0; i < length; i++) {
    try {
      await masterChef.updatePool(i.toString(), { from });
      console.log('Updated pool', i);
    } catch (e) {
      console.log('Unable to update pool', i, e.message);
    }
  }

  callback();
};
