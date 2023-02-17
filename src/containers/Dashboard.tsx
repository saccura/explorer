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
import { ArrowForwardIos, Height } from "@material-ui/icons";
import StatCharts from "../components/StatCharts";
import { Block as IBlock, IsSyncingResult as ISyncing} from "@etclabscore/ethereum-json-rpc";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryGroup } from "victory";
import BigNumber from "bignumber.js";
import CustomChartAxises from "../components/CustomChartAxises";
import { 
  gasUsedChartData, gasUsedPerTxChartData, transactionCountChartData, calcLabelsCount
} from "../helpers/chartDataFormating";
import { useWindowSize } from "usehooks-ts";
import CustomChartContainer from "../components/CustomChartContainer";
const unit = require("ethjs-unit"); //tslint:disable-line
const useState = React.useState;

const config = {
  blockTime: 15, // seconds
  blockHistoryLength: 100,
  // chartHeight: 452,
  // chartWidth: 740,
  chartHeight: 385,
  chartWidth: 740,
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
  const { width } = useWindowSize();
  const ref = React.useRef(null)

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

  React.useEffect(() => {
    console.log("ref: ", ref)
  }, [blockNumber])
 
  if (blocks === undefined || chainId === undefined || gasPrice === undefined || peerCount === undefined) {
    return <div className="curcular-wrapper"><CircularProgress /></div>;
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
      return {x: hexToNumber(block.number), y: new BigNumber(0)}
    }
    return {
      x: hexToNumber(block.number),
      y: new BigNumber(block.gasUsed).dividedBy(txCount)
    };
  };

  const victoryChartDynamicProps = (resolution: number, viewBoxOffsetX = -10, viewBoxOffsetY = 0) => {
    const isMobile: boolean = resolution < 768 ? true : false;
    const isDesktop: boolean = resolution >= 1280 ? true : false;
    const isTablet: boolean = resolution >= 768 ? true : false;
    const isFull: boolean = resolution >= 1920 ? true : false
    const width = isMobile ? 740 : 1000;
    const height = isFull ? 320 : (isDesktop ? 410 : isTablet ? 347 : 385)
    const viewBox = `${viewBoxOffsetX} ${viewBoxOffsetY} ${width} ${height}`

    return {
      containerComponent: <CustomChartContainer width={width} height={height} viewBox={viewBox}/>,
      //<VictoryContainer responsive={isMobile ? true : false} />,
      width,
      height
    }
  }
  

  const victoryBarDynamicProps = (resolution: number) => {
    const isMobile: boolean = resolution < 768 ? true : false;
    const isTablet: boolean = resolution >= 768 ? true : false;
    const isDesktop: boolean = resolution >= 1280 ? true : false;
  
    return {
      barWidth: isDesktop ? 15 : isTablet ? 12 : 15,
      cornerRadius: isDesktop ? 7 : isTablet ? 6 : 7,
    };
  };

  const domainPadding = (resolution: number, chartName: string) => {
    enum ChartNames {
      "TransactionCount" = "TransactionCount",
      "GasUsed" = "GasUsed",
      "GasPrice" = "GasPrice",
    }
  
    switch (chartName) {
      case ChartNames.TransactionCount:
        if (resolution < 768) {
          return {
            y: [0, 0],
            x: [200, -300],
          };
        }
        if (resolution >= 1920) {
          return {
            y: [0, 0],
            x: [0, 0],
          };
        }
        if (resolution >= 1280) {
          return {
            y: [0, 0],
            x: [10, -300],
          };
        }
        if (resolution >= 768) {
          return {
            y: [0, 0],
            x: [-15, -300],
          };
        }
  
        break;
      case ChartNames.GasUsed:
        if (resolution < 768) {
          return {
            y: [0, 0],
            x: [200, -300],
          };
        }
        if (resolution >= 1920) {
          return {
            y: [0, 0],
            x: [0, 0],
          };
        }
        if (resolution >= 1280) {
          return {
            y: [0, 0],
            x: [10, -300],
          };
        }
        if (resolution >= 768) {
          return {
            y: [0, 0],
            x: [-10, -310],
          };
        }
        break;
      case ChartNames.GasPrice:
        if (resolution < 768) {
          return {
            y: [0, 0],
            x: [40, -200],
          };
        }
        if (resolution >= 1920) {
          return {
            y: [0, 0],
            x: [20, 0],
          };
        }
        if (resolution >= 1280) {
          return {
            y: [0, 0],
            x: [20, -310],
          };
        }
        if (resolution >= 768) {
          return {
            y: [0, 0],
            x: [50, -300],
          };
        }
  
        break;
      default:
        return {
          y: [0, 0],
          x: [0, 0],
        };
    }
  };


  const calcChartDataCount = (resolution: number, custom = 0) => {
    if(custom) {
      return custom
    }
    
    if (resolution >= 1920) {
      return 42;
    }
  
    if (resolution >= 1280) {
      return 52;
    }
  
    if (resolution >= 768) {
      return 62;
    }
  
    return 36;
  };

  return (
    <div className="dashboard">
      <Grid className="dashboard-entities" item container justify="space-between">
          <Grid className="dashboard-entity blockHeightEntity" item key="blockHeightEntity">
            <div className="entity-left first">
              <ChartCard title={t("Block Height")}>
                <Typography className="block-height__title"  variant="h4">{blockNumber}</Typography>
              </ChartCard>
            </div>
            <div className="entity-right tx-count__chart first">
              <ChartCard title={t("Transaction count")}>
              <CustomChartAxises 
              xItems={transactionCountChartData(blocks, blockMapTransactionCount).slice(0, calcLabelsCount(width))} 
              />
              <VictoryChart
                {...victoryChartDynamicProps(width)}
                //@ts-ignore
                domainPadding={domainPadding(width, "TransactionCount")}
                >
                <VictoryBar
                {...victoryBarDynamicProps(width)}
                style={{
                  data: {fill: "#3772FF"}
                }}
                data={transactionCountChartData(blocks, blockMapTransactionCount, calcChartDataCount(width))}
                />

                <VictoryAxis
                  style={{
                    axis: {stroke: 'transparent'},
                    tickLabels: {fontSize: 14, fill: "transparent"},
                  }}
                  tickCount={6}
                  fixLabelOverlap={true}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: {stroke: 'transparent'},
                    tickLabels: {fontSize: width < 768 ? 24 : 22, fontFamily: "Poppins", fill: "#777E90", fontWeight: 500}
                  }}
                />
              </VictoryChart>
              </ChartCard>
            </div>
          </Grid>
          <Grid className="dashboard-entity chainIdEntity" key="chainIdEntity" item>
            <div className="entity-left second">
              <ChartCard title={t("Chain ID")}>
                <Typography className="chain-id__title" variant="h4">{hexToNumber(chainId)}</Typography>
              </ChartCard>
            </div>
            <div className="entity-right second">
              <Grid className="gas-used__chart" key="gasUsed" item>
                <ChartCard title={t("Gas Used (Millions)")}>
                <CustomChartAxises
                 xItems={gasUsedChartData(blocks, blockMapGasUsed).slice(0, calcLabelsCount(width))} 
                 />
                  <VictoryChart 
                    {...victoryChartDynamicProps(width)}
                    //@ts-ignore
                    domainPadding={domainPadding(width, "GasUsed")}
                  >
                    <VictoryBar
                    {...victoryBarDynamicProps(width)}
                    style={{
                      data: {fill: "#18B04D"}
                    }}
                    data={gasUsedChartData(blocks, blockMapGasUsed, calcChartDataCount(width))}
                    />
                    <VictoryAxis
                      style={{
                        axis: {stroke: 'transparent'},
                        tickLabels: {fontSize: 14, fill: "transparent"},
                      }}
                      tickCount={6}
                      fixLabelOverlap={true}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        axis: {stroke: 'transparent'},
                        tickLabels: {fontSize: width < 768 ? 24 : 22, fontFamily: "Poppins", fill: "#777E90", fontWeight: 500}
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
            <div className="entity-left third">
              <ChartCard title={t("Gas Price")}>
                <Typography variant="h4" className="gas-price__title">{unit.fromWei(hexToNumber(gasPrice), 'ether')} POPX</Typography>
              </ChartCard>
              <Grid key="peers" item>
                <ChartCard title={t("Peers")}>
                  <Typography variant="h4">{hexToNumber(peerCount)}</Typography>
                </ChartCard>
              </Grid>
            </div>
            <div className="entity-right third">
              <Grid className="gas-used__pertx" key="gasUsedPerTx" item>
                <ChartCard title={t("Gas Used per Tx")}>
                <CustomChartAxises 
                xItems={gasUsedPerTxChartData(blocks, blockMapGasUsedPerTx).slice(0, calcLabelsCount(width))} 
                />
                <VictoryChart
                  {...victoryChartDynamicProps(width, -65, 0)}
                  //@ts-ignore
                  domainPadding={domainPadding(width, "GasPrice")}
                  ref={ref}
                >
                  <VictoryBar
                    {...victoryBarDynamicProps(width)}
                    style={{
                      data: {fill: () => "#FD9821"}
                    }}
                    data={gasUsedPerTxChartData(blocks, blockMapGasUsedPerTx, calcChartDataCount(width))}
                  />
                  <VictoryAxis
                    style={{
                      axis: {stroke: 'transparent'},
                      tickLabels: {fontSize: 14, fill: "transparent"},
                    }}
                    tickCount={6}
                    fixLabelOverlap={true}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      axis: {stroke: 'transparent'},
                      tickLabels: {fontSize: width < 768 ? 24 : 22, fontFamily: "Poppins", fill: "#777E90", fontWeight: 500}
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

      <div className="more-stats__button">
        <Button
          color="primary"
          variant="outlined"
          onClick={() => props.history.push("/stats/miners")}
        >
        More Stats
        </Button>
      </div>

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
