const Marzipan = artifacts.require('CakeToken');

module.exports = async function (callback) {
  const marzipan = await Marzipan.deployed();
  const [from] = await web3.eth.getAccounts();

  async function logBalance() {
    const balance = (await marzipan.balanceOf(from)).toString();
    console.log('devaddr MZPN balance', web3.utils.fromWei(balance));
    return balance;
  }

  const balance = await logBalance();
  const tx = await marzipan.transfer(
    '0x0000000000000000000000000000000000000001',
    balance,
    {
      from,
    }
  );
  console.log('burned', tx.hash);

  await logBalance();

  callback();
};
