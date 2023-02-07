import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import AddressView from "../components/AddressView";
import _ from "lodash";
import getBlocks, { useBlockNumber } from "../helpers";
import useEthRPCStore from "../stores/useEthRPCStore";
import { hexToNumber } from "@etclabscore/eserialize";
import AddressTransactions from "../components/AddressTransactions";
import { History } from "history";
import { Transaction } from "@etclabscore/ethereum-json-rpc";
import BigNumber from "bignumber.js";
import { weiToGwei } from "../components/formatters";

const unit = require("ethjs-unit"); //tslint:disable-line

interface IProps {
  match: {
    params: {
      address: string,
      block: string,
    };
  };
  history: History;
}

const Address: React.FC<IProps> = ({ match, history }) => {
  const { address, block } = match.params;
  const [erpc] = useEthRPCStore();
  const [blockNumber] = useBlockNumber(erpc);
  const [transactionCount, setTransactionCount] = React.useState<string>();
  const [balance, setBalance] = React.useState<string>();
  const [code, setCode] = React.useState<string>();
  const blockNum = block === undefined ? blockNumber : parseInt(block, 10);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  console.log("parseInt(block, 10): ", parseInt(block, 10))

  const from = Math.max(blockNum ? blockNum : 0 - 99, 0);
  const to = blockNum;
  // const from = blockNumber - 100
  // const to = blockNumber;
  // console.log("from: ", from)
  // console.log("to: ", to)

  React.useEffect(() => {
    if (isNaN(blockNum) || isNaN(blockNumber)) {
      return;
    }
    if (blockNum > blockNumber) {
      history.push(`/address/${address}/${blockNumber}`);
    }
    if (blockNum < 0) {
      history.push(`/address/${address}/0`);
    }
  }, [blockNumber, blockNum, history, address]);

  React.useEffect(() => {
    if (blockNumber === undefined || !erpc) {
      return;
    }
    const hexBlockNumber = `0x${blockNumber.toString(16)}`;
    erpc.eth_getTransactionCount(address, hexBlockNumber).then((txCount) => {
      if (txCount === null) { return; }
      setTransactionCount(txCount);
      return txCount;
    }).then((txCountRes: string | undefined) => {
      if (txCountRes) {
        erpc.eth_getBalance(address, hexBlockNumber).then((b) => {
          if (b === null) { return; }
          setBalance(b);
        });
        erpc.eth_getCode(address, hexBlockNumber).then((c) => {
          if (c === null) { return; }
          setCode(c);
        });
      }
    });
  }, [blockNumber, address, erpc]);

  React.useEffect(() => {
    if (!erpc) { return; }
    getBlocks(from, to, erpc).then((blcks) => {
      const txes = _.flatMap(blcks, "transactions");
      const filteredTxes = _.filter(txes, (tx: any) => {
        if (!tx) {
          return false;
        }
        console.log("tx.to: ", tx.to)
        console.log("tx.from: ", tx.from)
        console.log("tx.from == address: ", tx.from == address)

        return tx.to === address || tx.from === address;
      });
      const sortedTxes = _.sortBy(filteredTxes, (tx: any) => {
        return hexToNumber(tx.blockNumber);
      }).reverse();
      setTransactions(sortedTxes);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  if (transactionCount === undefined || balance === undefined || code === undefined) {
    return <div className="curcular-wrapper"><CircularProgress /></div>;
  }

  return (
    <div className="address-page">
      <AddressView
        address={address}
        txCount={transactionCount ? hexToNumber(transactionCount) : 0}
        balance={String(Number(unit.fromWei(balance || 0, "ether")).toFixed())}
        code={code}
        className="view"
      />
      <AddressTransactions
        className="transactions"
        from={from}
        to={to}
        transactions={transactions}
        disablePrev={blockNum >= blockNumber}
        disableNext={blockNum === 0}
        onPrev={() => {
          const newQuery = blockNum + 100;
          history.push(`/address/${address}/${newQuery}`);
        }}
        onNext={() => {
          const newQuery = Math.max(blockNum - 100, 0);
          history.push(`/address/${address}/${newQuery}`);
        }}
      />
    </div>
  );
};

export default Address;
