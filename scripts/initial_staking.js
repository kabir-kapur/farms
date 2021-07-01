const Marzipan = artifacts.require('CakeToken');
const MasterChef = artifacts.require('MasterChef');
const { tokens, ubeswap } = require('../addresses');
const ERC20 = require('../abis/ERC20.json');
const UniswapFactory = require('../abis/UniswapFactory.json');

module.exports = async function (callback) {
  const marzipan = await Marzipan.deployed();
  const chef = await MasterChef.deployed();

  const [from] = await web3.eth.getAccounts();
  const networkId = await web3.eth.getChainId();

  const factory = new web3.eth.Contract(
    UniswapFactory,
    ubeswap[networkId].factory
  );

  // await marzipan.approve(chef.address, web3.utils.toWei('10'), { from });
  // console.log('Approved', 10);

  // try {
  //   await chef.enterStaking(web3.utils.toWei('9'), { from });
  //   console.log('Staked', 9);
  // } catch (e) {
  //   console.log(e);
  // }

  const entries = Object.entries(tokens[networkId]);
  for (let i = 0; i <= entries.length; i++) {
    const [ticker, address] = entries[i];
    console.log('Staking', ticker, '<> MZPN LP');
    const pair = await factory.methods
      .getPair(marzipan.address, address)
      .call();
    const lp = new web3.eth.Contract(ERC20, pair);
    console.log(
      web3.utils.fromWei((await lp.methods.balanceOf(from).call()).toString())
    );

    try {
      await lp.methods
        .approve(chef.address, web3.utils.toWei('1'))
        .send({ from });
      console.log('Approved');
      await chef.deposit(i + 1, web3.utils.toWei('0.1'), { from });
      console.log('Deposited');
    } catch (e) {
      console.log('e', e);
    }
  }

  callback();
};
