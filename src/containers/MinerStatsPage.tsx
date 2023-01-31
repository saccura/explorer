import { CircularProgress, useTheme, Theme } from "@material-ui/core";
import useEthRPCStore from "../stores/useEthRPCStore";
import * as React from "react";
import getBlocks, { useBlockNumber } from "../helpers";
// import MinerStats from "../components/MinerStats";
import MinerStatsTable from "../components/MinerStatsTable";
import StatCharts from "../components/StatCharts";
// import getTheme from "../themes/victoryTheme";
// import BlockPagination from "../components/BlockPagination";
import { History } from "history";
import _ from "lodash";
import { Block as IBlock } from "@etclabscore/ethereum-json-rpc";
import MinerStatsWithBlockPagination from "../components/MinerStatsWithBlockPagination";
import TableScrollCustomize from "../components/TableScrollCustomize";

const useState = React.useState;

const config = {
  blockTime: 15, // seconds
  blockHistoryLength: 100,
  chartHeight: 200,
  chartWidth: 400,
};
interface IProps {
  match: {
    params: {
      address: string,
      block: string,
    };
  };
  history: History;
}

export default (props: IProps) => {
  const [erpc] = useEthRPCStore();
  const [blockNumber] = useBlockNumber(erpc);
  const [blocks, setBlocks] = useState<IBlock[]>();
  //const theme = useTheme<Theme>();
  //const victoryTheme = getTheme(theme);
  const { block } = props.match.params;
  const blockNum = block !== undefined ? parseInt(block, 10) : blockNumber;
  const from = Math.max(blockNum - 99, 0);
  const to = blockNum;

  React.useEffect(() => {
    if (blockNum === undefined || blockNumber === undefined) {
      return;
    }
    if (blockNum > blockNumber) {
      props.history.push(`/stats/miners/${blockNumber}`);
    }
    if (blockNum < 0) {
      props.history.push(`/stats/miners/0`);
    }
  }, [blockNumber, blockNum, props.history]);

  React.useEffect(() => {
    if (!erpc) { return; }
    getBlocks(
      from,
      to,
      erpc,
    ).then((bl) => {
      setBlocks(_.compact(bl));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  if (!blocks || blockNumber === undefined || blockNum > blockNumber) {
    return (<CircularProgress />);
  }

  return (
    <div className="miner">
      <div className="miner-left">
        <div className="miner-charts">
          <StatCharts 
          blocks={blocks}
          minerChart={
            <MinerStatsWithBlockPagination
            blocks={blocks} config={config}
            from={from}
            to={to}
            disablePrev={blockNum >= blockNumber}
            disableNext={blockNum === 0}
            onPrev={() => {
              const newQuery = blockNum + 100;
              props.history.push(`/stats/miners/${newQuery}`);
            }}
            onNext={() => {
              const newQuery = Math.max(blockNum - 100, 0);
              props.history.push(`/stats/miners/${newQuery}`);
            }}
          />
          }
          //victoryTheme={victoryTheme} 
          />
        </div>
        {/* <div className="miner-info"> */}
          {/* <MinerStatsWithBlockPagination
            blocks={blocks} config={config}
            from={from}
            to={to}
            disablePrev={blockNum >= blockNumber}
            disableNext={blockNum === 0}
            onPrev={() => {
              const newQuery = blockNum + 100;
              props.history.push(`/stats/miners/${newQuery}`);
            }}
            onNext={() => {
              const newQuery = Math.max(blockNum - 100, 0);
              props.history.push(`/stats/miners/${newQuery}`);
            }}
          /> */}
          {/* <MinerStats blocks={blocks} config={config} />
          <BlockPagination
            from={from}
            to={to}
            disablePrev={blockNum >= blockNumber}
            disableNext={blockNum === 0}
            onPrev={() => {
              const newQuery = blockNum + 100;
              props.history.push(`/stats/miners/${newQuery}`);
            }}
            onNext={() => {
              const newQuery = Math.max(blockNum - 100, 0);
              props.history.push(`/stats/miners/${newQuery}`);
            }}
          ></BlockPagination> */}
        {/* </div> */}
      </div>
      <TableScrollCustomize
      mainTableWrapperClass="miner-table"
      scrollChildContentWidth={1217} 
      scrollChildContentHeight={20} 
      scrollWrappertranslateY={60}
    >
      <div className="miner-right">
        <div className="miner-table">
          <MinerStatsTable blocks={blocks} />
        </div>
      </div>
      </TableScrollCustomize>
    </div>
  );
};
