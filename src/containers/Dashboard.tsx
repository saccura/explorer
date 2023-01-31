import { Grid, Typography, CircularProgress, Theme, Button, CssBaseline } from "@material-ui/core";
import useEthRPCStore from "../stores/useEthRPCStore";
import * as React from "react";
import { weiToGwei } from "../components/formatters";
import HashRate from "../components/HashRate";
import getBlocks, { useBlockNumber } from "../helpers";
import useInterval from "use-interval";
import { useTheme } from "@material-ui/styles";
import getTheme from "../themes/victoryTheme";
import ChartCard from "../components/ChartCard";
import BlockListContainer from "./BlockList";
import { hexToNumber } from "@etclabscore/eserialize";
import { useTranslation } from "react-i18next";
import { ArrowForwardIos } from "@material-ui/icons";
import StatCharts from "../components/StatCharts";
import { Block as IBlock, IsSyncingResult as ISyncing} from "@etclabscore/ethereum-json-rpc";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryGroup } from "victory";
import BigNumber from "bignumber.js";

const useState = React.useState;

const config = {
  blockTime: 15, // seconds
  blockHistoryLength: 100,
  chartHeight: 300,
  chartWidth: 600,
};

export default (props: any) => {
  const [erpc] = useEthRPCStore();
  const theme = useTheme<Theme>();
  //const victoryTheme = getTheme(theme);
  const [blockNumber] = useBlockNumber(erpc);
  const [chainId, setChainId] = useState<string>();
  const [block, setBlock] = useState<IBlock>();
  const [blocks, setBlocks] = useState<IBlock[]>();
  const [gasPrice, setGasPrice] = useState<string>();
  const [syncing, setSyncing] = useState<ISyncing>();
  const [peerCount, setPeerCount] = useState<string>();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.eth_chainId().then((cid) => {
      if (cid === null) { return; }
      setChainId(cid);
    });
  }, [erpc]);

  React.useEffect(() => {
    if (!erpc || blockNumber === undefined) { return; }
    erpc.eth_getBlockByNumber(`0x${blockNumber.toString(16)}`, true).then((b) => {
      if (b === null) { return; }
      setBlock(b);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  React.useEffect(() => {
    if (!erpc || blockNumber === null) { return; }
    getBlocks(
      Math.max(blockNumber - config.blockHistoryLength + 1, 0),
      blockNumber,
      erpc,
    ).then((bl) => {
      setBlocks(bl);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  useInterval(() => {
    if (!erpc) { return; }
    erpc.eth_syncing().then(setSyncing);
  }, 10000, true);

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.net_peerCount().then(setPeerCount);
  }, [erpc]);

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.eth_gasPrice().then(setGasPrice);
  }, [erpc]);
 
  if (blocks === undefined || chainId === undefined || gasPrice === undefined || peerCount === undefined) {
    return <CircularProgress />;
  }

  const blockMapTransactionCount = (block: any) => {
    return {
      x: hexToNumber(block.number),
      y: block.transactions.length,
    };
  };

  const blockMapGasUsed = (block: any) => {
    return {
      x: hexToNumber(block.number),
      y: new BigNumber(block.gasUsed).dividedBy(1000000),
    };
  };

  const blockMapGasUsedPerTx = (block: any) => {
    const txCount = block.transactions.length
    const gasUsed = hexToNumber(block.gasUsed)

    if(!txCount && !gasUsed) {
      return {x: hexToNumber(block.number), y: 0}
    }
    return {
      x: hexToNumber(block.number),
      y: new BigNumber(block.gasUsed).dividedBy(txCount)
    };
  };




  return (
    <div className="dashboard">
      <Grid className="dashboard-entities" item container justify="space-between">
          <Grid className="dashboard-entity blockHeightEntity" item key="blockHeightEntity">
            <div className="entity-left">
              <ChartCard title={t("Block Height")}>
                <Typography variant="h4">{blockNumber}</Typography>
              </ChartCard>
            </div>
            <div className="entity-right">
              <ChartCard title={t("Transaction count")}>
              <VictoryChart height={config.chartHeight} width={config.chartWidth}>
                <VictoryBar
                barWidth={4}
                cornerRadius={2}
                style={{
                  data: {fill: "#3772FF"}
                }}
                data={blocks.map(blockMapTransactionCount)} 
                />
                <VictoryAxis
                  style={{
                    axis: {stroke: 'transparent'},
                    tickLabels: {fontSize: 14, fill: "#23262F"}
                  }}
                />
                <VictoryAxis
                  dependentAxis
                      //domain={[0, 80]}
                  style={{
                    axis: {stroke: 'transparent'},
                    tickLabels: {fontSize: 10, fill: "#777E90"}
                  }}
                />
              </VictoryChart>
              </ChartCard>
            </div>
          </Grid>
          <Grid className="dashboard-entity chainIdEntity" key="chainIdEntity" item>
            <div className="entity-left">
              <ChartCard title={t("Chain ID")}>
                <Typography variant="h4">{hexToNumber(chainId)}</Typography>
              </ChartCard>
            </div>
            <div className="entity-right">
              <Grid key="gasUsed" item>
                <ChartCard title={t("Gas Used (Millions)")}>
                  <VictoryChart height={config.chartHeight} width={config.chartWidth}>
                    <VictoryBar
                    barWidth={4}
                    cornerRadius={2}
                    style={{
                      data: {fill: "#18B04D"}
                    }}
                    data={blocks.map(blockMapGasUsed)}
                    />
                    <VictoryAxis
                      style={{
                        axis: {stroke: 'transparent'},
                        tickLabels: {fontSize: 14, fill: "#23262F"}
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      //domain={[0, 80]}
                      style={{
                        axis: {stroke: 'transparent'},
                        tickLabels: {fontSize: 10, fill: "#777E90"}
                      }}
                    />
                  </VictoryChart>
                </ChartCard>
              </Grid>
            </div>
          </Grid>
          {syncing &&
            <div key="syncing">
              <ChartCard title={t("Syncing")}>
                {typeof syncing === "object" && syncing.currentBlock &&
                  <Typography variant="h4">
                    {hexToNumber(syncing.currentBlock)} / {hexToNumber(syncing.highestBlock || "0x0")}
                  </Typography>
                }
              </ChartCard>
            </div>
          }
          <Grid className="dashboard-entity gasPriceEntity" key="gasPriceEntity" item>
            <div className="entity-left">
              <ChartCard title={t("Gas Price")}>
                <Typography variant="h4">{weiToGwei(hexToNumber(gasPrice))} POPX</Typography>
              </ChartCard>
              <Grid key="peers" item>
                <ChartCard title={t("Peers")}>
                  <Typography variant="h4">{hexToNumber(peerCount)}</Typography>
                </ChartCard>
              </Grid>
            </div>
            <div className="entity-right">
              <Grid key="gasUsedPerTx" item>
                <ChartCard title={t("Gas Used per Tx")}>
                  <VictoryChart height={config.chartHeight} width={config.chartWidth}>
                    <VictoryBar
                    barWidth={4}
                    cornerRadius={2}
                    padding={{left: 2, right: 2}}
                    //cornerRadius={4}
                    style={{
                      data: {fill: "#FD9821"},
                    }}
                    data={blocks.map(blockMapGasUsedPerTx)} 
                    />
                    <VictoryAxis
                      style={{
                        axis: {stroke: 'transparent'},
                        tickLabels: {fontSize: 14, fill: "#23262F"}
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      //domain={[0, 80]}
                      style={{
                        axis: {stroke: 'transparent'},
                        tickLabels: {fontSize: 10, fill: "#777E90"}
                      }}
                    />
                  </VictoryChart>
                    {/* <VictoryBar
                    containerComponent={<VictoryContainer responsive={false}/>}
                    width={310}
                    height={158}
                    barWidth={6}
                    padding={{left: 2, right: 2}}
                    cornerRadius={4}
                    style={{
                      data: {fill: "#FD9821"},
                    }}
                    data={blocks.map(blockMapGasUsedPerTx)} 
                    /> */}
                </ChartCard>
              </Grid>
            </div>
          </Grid>
          {/* <Grid key="hRate" item>
            <ChartCard title={t("Network Hash Rate")}>
              {block &&
                <HashRate block={block} blockTime={config.blockTime}>
                  {(hashRate: any) => <Typography variant="h4">{hashRate} GH/s</Typography>}
                </HashRate>
              }
            </ChartCard>
          </Grid> */}
      </Grid>
      {/* <StatCharts 
      // victoryTheme={victoryTheme} 
      blocks={blocks} /> */}
      {/* <Grid container justify="flex-end">
        <Button
          color="primary"
          variant="outlined"
          endIcon={<ArrowForwardIos />}
          onClick={() => props.history.push("/stats/miners")}
        >More Stats</Button>
      </Grid>
      <br /> */}

      <BlockListContainer
        from={Math.max(blockNumber - 14, 0)}
        to={blockNumber}
        disablePrev={true}
        disableNext={blockNumber < 14}
        onNext={() => {
          props.history.push(`/blocks/${blockNumber - 15}`);
        }}
        style={{ marginTop: "30px" }} />
    </div >
  );
};
