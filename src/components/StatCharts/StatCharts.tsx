import React from "react";
import BigNumber from "bignumber.js";
import { hashesToGH, weiToGwei } from "../formatters";
import { hexToNumber } from "@etclabscore/eserialize";
import { Grid, Typography } from "@material-ui/core";
import ChartCard from "../ChartCard";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryContainer } from "victory";
import { useTranslation } from "react-i18next";
import { 
  gasUsedChartData, 
  gasUsedPerTxChartData, 
  transactionCountChartData,
} from "../../helpers/chartDataFormating";
import CustomChartAxises from "../CustomChartAxises";
import { useBlockNumber } from "../../helpers";
import useEthRPCStore from "../../stores/useEthRPCStore";
import { useWindowSize } from "usehooks-ts";
import CustomChartContainer from "../CustomChartContainer";

const config = {
  blockTime: 15, // seconds
  blockHistoryLength: 100,
  chartHeight: 385,
  chartWidth: 740,
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

const blockMapUncles = (block: any) => {
  return {
    x: hexToNumber(block.number),
    y: block.uncles.length,
  };
};

const blockMapHashRate = (block: any) => {
  return {
    x: hexToNumber(block.number),
    y: hashesToGH(new BigNumber(block.difficulty, 16).dividedBy(config.blockTime)),
  };
};

const blockMapTransactionCount = (block: any) => {
  return {
    x: hexToNumber(block.number),
    y: block.transactions.length,
  };
};

interface IProps {
  blocks: any[];
  victoryTheme?: any;
  minerChart: any;
  blockNumber: number;
  chainId: string,
  gasPrice: string | null,
  peerCount: string | null
}

const StatCharts: React.FC<IProps> = ({ blocks, victoryTheme, minerChart, blockNumber, chainId, gasPrice, peerCount }) => {
  const { t } = useTranslation();
  const { width } = useWindowSize()


  // const victoryChartDynamicProps = (resolution: number) => {
  //   const isMobile: boolean = resolution < 768 ? true : false
  //   return {
  //     containerComponent: <VictoryContainer responsive={isMobile ? true : false} />,
  //     width: isMobile ? 740 : 1000,
  //     height: isMobile ? 385 : 500
  //   }
  // }

  const victoryChartDynamicProps = (resolution: number, viewBoxOffsetX = -10, viewBoxOffsetY = 0) => {
    const isMobile: boolean = resolution < 768 ? true : false;
    const isDesktop: boolean = resolution >= 1280 ? true : false;
    const isTablet: boolean = resolution >= 768 ? true : false;
    const isFull: boolean = resolution >= 1920 ? true : false
    const width = isMobile ? 740 : 1000;
    const height = isFull ? 415 : (isDesktop ? 345 : isTablet ? 485 : 385)

    const viewBox = `${viewBoxOffsetX} ${viewBoxOffsetY} ${width} ${height}`

    return {
      containerComponent: <CustomChartContainer width={width} height={height} viewBox={viewBox}/>,
      //<VictoryContainer responsive={isMobile ? true : false} />,
      width,
      height
    }
  }

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
            x: [0, 0],
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
            x: [15, 0],
          };
        }
        if (resolution >= 768) {
          return {
            y: [0, 0],
            x: [200, 0],
          };
        }
  
        break;
      case ChartNames.GasUsed:
        if (resolution < 768) {
          return {
            y: [0, 0],
            x: [200, 0],
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
            x: [0, 0],
          };
        }
        if (resolution >= 768) {
          return {
            y: [0, 0],
            x: [10, 0],
          };
        }
        break;
      case ChartNames.GasPrice:
        if (resolution < 768) {
          return {
            y: [0, 0],
            x: [40, 0],
          };
        }
        if (resolution >= 1920) {
          return {
            y: [0, 0],
            x: [20, 75],
          };
        }
        if (resolution >= 1280) {
          return {
            y: [0, 0],
            x: [25, 0],
          };
        }
        if (resolution >= 768) {
          return {
            y: [0, 0],
            x: [200, 0],
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

  const calcLabelsCount = (resolution: number) => {
    if (resolution >= 1920) {
      return 10
    }
  
    if (resolution >= 1280) {
      return 7;
    }
    
    if(resolution >= 768) {
      return 7
    }
  
  
    return 6;
  };

  const victoryBarDynamicProps = (resolution: number) => {
    const isMobile: boolean = resolution < 768 ? true : false;
    const isTablet: boolean = resolution >= 768 ? true : false;
    const isDesktop: boolean = resolution >= 1280 ? true : false;
  
    return {
      barWidth: isDesktop ? 15 : isTablet ? 19 : 15,
      cornerRadius: isDesktop ? 7 : isTablet ? 10 : 7,
    };
  };

  const calcChartDataCount = (resolution: number, custom = 0) => {
    if(custom) {
      return custom
    }
    
    if (resolution >= 1920) {
      return 42;
    }
  
    if (resolution >= 1280) {
      return 42;
    }
  
    if (resolution >= 768) {
      return 32;
    }
  
    return 32;
  };

  return (
    <Grid item container>
      <div className="chart-item first">
        {width < 768 && !isNaN(blockNumber) && <div className="mobile-block__number">
          <ChartCard title={t("Block Height")}>
            <Typography className="block-height__title"  variant="h4">{blockNumber}</Typography>
          </ChartCard>
        </div>}
        <Grid className="transaction-count tx-count__chart">
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
        </Grid>
      </div>

      <div className="chart-item second">
      {width < 768 && <div className="mobile-chain__id">
            <ChartCard title={t("Chain ID")}>
              <Typography className="chain-id__title" variant="h4">{hexToNumber(chainId)}</Typography>
            </ChartCard>
          </div>
      }
        <Grid className="gas-used" key="gasUsed" item>
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
        <div className="chart-item third">
          {width < 768 && gasPrice && peerCount &&<div className="mobile-gas__price">
            <ChartCard title={t("Gas Price")}>
              <Typography variant="h4" className="gas-price__title">{weiToGwei(hexToNumber(gasPrice))} POPX</Typography>
            </ChartCard>
            <Grid key="peers" item>
              <ChartCard title={t("Peers")}>
                <Typography className="peers-title" variant="h4">{hexToNumber(peerCount)}</Typography>
              </ChartCard>
            </Grid>
          </div>}
          <Grid className="gas-used__pertx" key="gasUsedPerTx" item>
            <ChartCard title={t("Gas Used per Tx")}>
            <CustomChartAxises 
                xItems={gasUsedPerTxChartData(blocks, blockMapGasUsedPerTx).slice(0, calcLabelsCount(width))} 
                />
                <VictoryChart
                  {...victoryChartDynamicProps(width, -65)}
                  //@ts-ignore
                  domainPadding={domainPadding(width, "GasPrice")}
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
                    //offsetX={60}
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
      <div className="chart-item fourth">
        <Grid>
          {minerChart}
        </Grid>
      </div>
      {/* <Grid key="hashChart" item xs={12} md={6} lg={3}>
        <ChartCard title={t("Hash Rate")}>
          <VictoryChart height={config.chartHeight} width={config.chartWidth} theme={victoryTheme as any}>
            <VictoryLine data={blocks.map(blockMapHashRate)} />
          </VictoryChart>
        </ChartCard>
      </Grid>
      <Grid key="txChart" item xs={12} md={6} lg={3}>
        <ChartCard title={t("Transaction count")}>
          <VictoryChart height={config.chartHeight} width={config.chartWidth} theme={victoryTheme as any}>
            <VictoryBar data={blocks.map(blockMapTransactionCount)} />
          </VictoryChart>
        </ChartCard>
      </Grid>
      <Grid key="gasUsed" item xs={12} md={6} lg={3}>
        <ChartCard title={t("Gas Used (Millions)")}>
          <VictoryChart height={config.chartHeight} width={config.chartWidth} theme={victoryTheme as any}>
            <VictoryBar data={blocks.map(blockMapGasUsed)} />
          </VictoryChart>
        </ChartCard>
      </Grid>
      <Grid key="gasUsedPerTx" item xs={12} md={6} lg={3}>
        <ChartCard title={t("Gas Used per Tx")}>
          <VictoryChart height={config.chartHeight} width={config.chartWidth} theme={victoryTheme as any}>
            <VictoryBar data={blocks.map(blockMapGasUsedPerTx)} />
          </VictoryChart>
        </ChartCard>
      </Grid>
      <Grid key="uncles" item xs={12} md={6} lg={3}>
        <ChartCard title={t("Uncles")}>
          <VictoryChart height={config.chartHeight} width={config.chartWidth} theme={victoryTheme as any}>
            <VictoryBar data={blocks.map(blockMapUncles)} />
          </VictoryChart>
        </ChartCard>
      </Grid> */}
    </Grid>
  );
};

export default StatCharts;
