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

export interface AddressTransaction {
  blockNumber: number,
  hash: string,
  from: string,
  to: string,
  transactionIndex?: number,
  timestamp: number
}

const Address: React.FC<IProps> = ({ match, history }) => {
  const { address, block } = match.params;
  const [erpc] = useEthRPCStore();
  const [blockNumber] = useBlockNumber(erpc);
  const [transactionCount, setTransactionCount] = React.useState<number>(0);
  const [balance, setBalance] = React.useState<string>();
  const [code, setCode] = React.useState<string>();
  const blockNum = block === undefined ? blockNumber : parseInt(block, 10);
  const [transactions, setTransactions] = React.useState<AddressTransaction[]>([]);
  const [transactionsState, setTransactionsState] = React.useState<AddressTransaction[]>([]);
  const [blockRange, setBlockRange] = React.useState({from: 0, to: 0, offset: 100})
  // const from = Math.max(blockNum ? blockNum : 0 - 99, 0);
  // const to = blockNum;
  // React.useEffect(() => {
  //   if (isNaN(blockNum) || isNaN(blockNumber)) {
  //     return;
  //   }
  //   if (blockNum > blockNumber) {
  //     history.push(`/address/${address}/${blockNumber}`);
  //   }
  //   if (blockNum < 0) {
  //     history.push(`/address/${address}/0`);
  //   }
  // }, [blockNumber, blockNum, history, address]);

  React.useEffect(() => {
    if (blockNumber === undefined || !erpc) {
      return;
    }
    const hexBlockNumber = `0x${blockNumber.toString(16)}`;
    erpc.eth_getTransactionCount(address, hexBlockNumber).then((txCount) => {
      if (txCount === null) { return; }
      //setTransactionCount(txCount);
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
    
    const body = JSON.stringify({
       "query": `{\n  ethereum(network: moonbeam) {\nsent: transactions(\noptions: {limit: ${300}, desc: ["block.height"]}\ntxSender: {is: \"${address}\"}\n) {\nblock {\nheight\ntimestamp {\nunixtime\n}\n}\nhash\namount\ncurrency {\nname\nsymbol\n}\ngasValue\nsender {\naddress\n}\nto {\naddress\n}\n}\nrec: transactions(\noptions: {limit: ${300}, desc: ["block.height"]}\ntxTo: {is: \"${address}\"}\n) {\nblock {\nheight\ntimestamp {\nunixtime\n}\n}\nhash\namount\ncurrency {\nname\nsymbol\n}\ngasValue\nsender {\naddress\n}\nto {\naddress\n}\n}\n}\n}\n`,
       "variables": "{}"
    });
    const apiKeys = ["BQYQCRyWgTrTYOB9DhZVzyT6Ru49idmU", "BQYPeN7UOwazJBEie2CisUPK95JUtkBl", "BQY6dAby8rxSeRRJxLxDK4Ry0G322FxT"]
    const random = Math.floor(Math.random() * apiKeys.length);
    const apiKey = apiKeys[random]

    fetch("https://graphql.bitquery.io", {
      method: 'POST',
      headers: {
       "Content-Type": "application/json",
       "X-API-KEY": apiKey
      },
      body,
    })
    .then(response => response.json())
    .then(result => {
      const sent = result.data.ethereum.sent
      const recived = result.data.ethereum.rec
      const txs: AddressTransaction[] = [...sent, ...recived].map((tx: any, ndx: number) => {
        const transaction: AddressTransaction = {
          blockNumber: tx.block.height, 
          hash: tx.hash, 
          from: tx.sender.address, 
          to: tx.to.address, 
          transactionIndex: ndx,
          timestamp: tx.block.timestamp.unixtime
        }
        return transaction
      }).sort((a: any, b: any) => {
        return b.timestamp - a.timestamp
      }).map((tx: AddressTransaction, ndx) => {
        return {...tx, transactionIndex: ndx + 1}
      })

      const txsCount = txs.length
      const firstBlock = txs[0].blockNumber
      const lastBlock = txs[txsCount - 1].blockNumber
      setBlockRange({from: firstBlock, to: firstBlock + 100, offset: 100})
      setTransactionCount(txsCount)
      setTransactions(txs)
      setTransactionsState(txs.slice(0, 100))
    })
    .catch(error => console.log('error: ', error));

    // data.ethereum.rec //inputs
    // data.ethereum.sent //outputs

    // getBlocks(from, to, erpc).then((blcks) => {
    //   const txes = _.flatMap(blcks, "transactions");
    //   const filteredTxes = _.filter(txes, (tx: any) => {
    //     if (!tx) {
    //       return false;
    //     }
    //     // console.log("tx.to: ", tx.to)
    //     // console.log("tx.from: ", tx.from)
    //     // console.log("tx.from == address: ", tx.from == address)

    //     return tx.to === address || tx.from === address;
    //   });
    //   const sortedTxes = _.sortBy(filteredTxes, (tx: any) => {
    //     return hexToNumber(tx.blockNumber);
    //   }).reverse();
    //   setTransactions(sortedTxes);
    // });

    // fetchTransactionsByAddress("0x22827df138fb40f2a80c00245af2177b5eb71f38")
    // .then((res: any) => console.log("res: ", res))
    // .catch((err: any) => console.log("err: ", err))

    // erpc.eth_getLogs({
    //   address: "0xC38bCF2eed198E072a92E66435Dd1157364C3e7c",
    //   // topics: [
    //   //   "18f97349e2112b9bffbdee9205cc6b276d318f3450e7d831bf1304fb0c5f7efc",
    //   //   "",
    //   //   "18f97349e2112b9bffbdee9205cc6b276d318f3450e7d831bf1304fb0c5f7efc",
    //   //   //"18f97349e2112b9bffbdee9205cc6b276d318f3450e7d831bf1304fb0c5f7efc",
    //   //   //"18f97349e2112b9bffbdee9205cc6b276d318f3450e7d831bf1304fb0c5f7efc"
    //   // ]
    // })
    // .then(res => console.log("eth_getFilterLogsRes: ", res))
    // .catch(err => console.log("eth_getFilterLogsErr: ", err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erpc]);

  if (transactionCount === undefined || balance === undefined || code === undefined) {
    return <div className="curcular-wrapper"><CircularProgress /></div>;
  }
  return (
    <div className="address-page">
      <AddressView
        address={address}
        txCount={transactionCount}
        balance={String(Number(unit.fromWei(balance || 0, "ether")).toFixed())}
        code={code}
        className="view"
      />
      <AddressTransactions
        className="transactions"
        from={blockRange.from}
        to={blockRange.to}
        transactions={transactionsState}
        totalxsLength={transactions.length}
        disablePrev={blockRange.offset <= 100}
        disableNext={
          !transactions.slice(blockRange.offset, blockRange.offset + 100).length || blockRange.offset >= 600
        }
        onPrev={() => {
          const endOffset = blockRange.offset - 100
          const startOffset = endOffset - 100
          const newSlice = transactions.slice(startOffset, endOffset)
          const startBlock = newSlice[0].blockNumber

          setBlockRange(() => ({from: newSlice[newSlice.length - 1].blockNumber, to: newSlice[0].blockNumber, offset: endOffset}))
          setTransactionsState(newSlice)
          history.push(`/address/${address}/${startBlock}`);
        }}
        onNext={() => {
          const endOffset = blockRange.offset + 100
          const startOffset = blockRange.offset
          const newSlice = transactions.slice(startOffset, endOffset)
          const startBlock = newSlice[0].blockNumber
          setBlockRange(() => ({from: newSlice[newSlice.length - 1].blockNumber, to: newSlice[0].blockNumber, offset: endOffset}))
          setTransactionsState(newSlice)
          history.push(`/address/${address}/${startBlock}`);
        }}
      />
    </div>
  );
};

export default Address;
