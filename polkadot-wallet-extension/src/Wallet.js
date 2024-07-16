import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { mnemonicGenerate, cryptoWaitReady, keyring } from '@polkadot/util-crypto';

const Wallet = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const init = async () => {
      await cryptoWaitReady();
      const mnemonic = mnemonicGenerate();
      const kr = keyring.createFromUri(mnemonic, { name: 'sr25519' });

      const provider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      setAddress(kr.address);

      const { data: balance } = await api.query.system.account(kr.address);
      setBalance(balance.free.toHuman());
    };

    init();
  }, []);

  return (
    <div className="wallet">
      <h1>Polkadot Wallet</h1>
      <p>Address: {address}</p>
      <p>Balance: {balance}</p>
    </div>
  );
};

export default Wallet;
