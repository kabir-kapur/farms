const Marzipan = artifacts.require('CakeToken');
const MasterChef = artifacts.require('MasterChef');
const UniswapFactory = require('../abis/UniswapFactory.json');
const UniswapRouter = require('../abis/UniswapRouter.json');
const ERC20 = require('../abis/ERC20.json');
const { tokens, ubeswap } = require('../addresses');

module.exports = async function (callback) {
  const marzipan = await Marzipan.deployed();
  const chef = await MasterChef.deployed();

  const [deployer] = await web3.eth.getAccounts();
  const networkId = await web3.eth.getChainId();

  const amount = web3.utils.toWei('10');

  const factory = new web3.eth.Contract(
    UniswapFactory,
    ubeswap[networkId].factory
  );
  const pair = await factory.methods
    .getPair(marzipan.address, tokens[networkId].CELO)
    .call();
  const lp = new web3.eth.Contract(ERC20, pair);
  await lp.methods.approve(chef.address, amount).send({ from: deployer });

  await marzipan.approve(chef.address, amount, { from: deployer });
  console.log('Approved');

  try {
    console.log(
      'allowance',
      web3.utils.fromWei(
        (await marzipan.allowance(deployer, chef.address)).toString()
      )
    );
    console.log(
      'balance',
      web3.utils.fromWei((await marzipan.balanceOf(deployer)).toString())
    );
    await chef.enterStaking(web3.utils.toWei('1'), { from: deployer });
    console.log('Staked');
  } catch (e) {
    console.log(e);
  }

  // for (const [name, address] of Object.entries(tokens[networkId])) {
  //   console.log('Adding liquidity for', name, '<> MZPN pair');
  //   const pair = await factory.methods
  //     .getPair(marzipan.address, address)
  //     .call();

  //   await marzipan.approve(
  //     ubeswap[networkId].router,
  //     web3.utils.toWei('1000'),
  //     { from: deployer }
  //   );
  //   await marzipan.approve(pair, web3.utils.toWei('1000'), { from: deployer });
  //   console.log('Approved MZPN');

  //   const erc20 = new web3.eth.Contract(ERC20, address);
  //   await new Promise((resolve) =>
  //     erc20.methods
  //       .approve(ubeswap[networkId].router, web3.utils.toWei('1000'))
  //       .send({ from: deployer })
  //       .on('confirmation', resolve)
  //   );
  //   await new Promise((resolve) =>
  //     erc20.methods
  //       .approve(pair, web3.utils.toWei('1000'))
  //       .send({ from: deployer })
  //       .on('confirmation', resolve)
  //   );
  //   console.log('Approved', name);

  //   await new Promise((resolve, reject) =>
  //     router.methods
  //       .addLiquidity(
  //         marzipan.address,
  //         address,

  //         web3.utils.toWei('10'),
  //         web3.utils.toWei('1'),

  //         web3.utils.toWei('1'),
  //         web3.utils.toWei('1'),

  //         deployer,
  //         Date.now() + 1000 * 60 * 60
  //       )
  //       .send({ from: deployer })
  //       .on('confirmation', resolve)
  //       .on('error', reject)
  //   );
  //   console.log('Added liquidity', name);
  // }

  callback();
};
