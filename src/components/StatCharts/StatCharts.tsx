import React from "react";
import BigNumber from "bignumber.js";
import { hashesToGH } from "../formatters";
import { hexToNumber } from "@etclabscore/eserialize";
import { Grid } from "@material-ui/core";
import ChartCard from "../ChartCard";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";
import { useTranslation } from "react-i18next";
import { gasUsedChartData, gasUsedPerTxChartData, transactionCountChartData } from "../../helpers/chartDataFormating";
import CustomChartAxises from "../CustomChartAxises";

const config = {
  blockTime: 15, // seconds
  blockHistoryLength: 100,
  chartHeight: 300,
  chartWidth: 600,
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
  minerChart: any
}

const StatCharts: React.FC<IProps> = ({ blocks, victoryTheme, minerChart }) => {
  const { t } = useTranslation();
  return (
    <Grid item container>
      <div className="chart-item">
        <Grid className="transaction-count">
          <ChartCard title={t("Transaction count")}>
            <CustomChartAxises 
            xItems={transactionCountChartData(blocks, blockMapTransactionCount).slice(0,6)} 
            yItems={[0, 20, 40, 60, 80]}/>
            <VictoryChart 
            //height={config.chartHeight} 
            //width={config.chartWidth}
            >
              <VictoryBar
                barWidth={8}
                cornerRadius={4}
                style={{
                  data: {fill: "#3772FF"}
                }}
                data={transactionCountChartData(blocks, blockMapTransactionCount)}
                //data={blocks.map(blockMapTransactionCount)} 
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
                tickValues={[0, 20, 40, 60, 80]}
                style={{
                  axis: {stroke: 'transparent'},
                  tickLabels: {fontSize: 10, fill: "transparent"}
                }}
              />
            </VictoryChart>
            </ChartCard>
        </Grid>
      </div>

      <div className="chart-item">
        <Grid className="gas-used" key="gasUsed" item>
          <ChartCard title={t("Gas Used (Millions)")}>
          <CustomChartAxises
            xItems={gasUsedChartData(blocks, blockMapGasUsed).slice(0,6)} 
            yItems={["1.0", "2.0", "3.0", "4.0", "5.0", "6.0"]}
            />
            <VictoryChart 
            //height={config.chartHeight} 
            //width={config.chartWidth}
            >
              <VictoryBar
                barWidth={8}
                cornerRadius={4}
                style={{
                  data: {fill: "#18B04D"}
                }}
                data={gasUsedChartData(blocks, blockMapGasUsed)}
                //data={blocks.map(blockMapGasUsed)}
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
                tickValues={[1, 2, 3, 4, 5, 6]}
                style={{
                  axis: {stroke: 'transparent'},
                  tickLabels: {fontSize: 10, fill: "transparent"}
                }}
              />
            </VictoryChart>
          </ChartCard>
          </Grid>
      </div>
        <div className="chart-item">
          <Grid className="gas-used__pertx" key="gasUsedPerTx" item>
            <ChartCard title={t("Gas Used per Tx")}>
            <CustomChartAxises xItems={gasUsedPerTxChartData(blocks, blockMapGasUsedPerTx).slice(0,6)} yItems={["100,000", "200,000", "300,000", "400,000","500,000"]}/>
            <VictoryChart 
              // height={config.chartHeight} 
              // width={config.chartWidth}
              >
              <VictoryBar
                barWidth={8}
                cornerRadius={4}
                padding={{left: 2, right: 2}}
                //cornerRadius={4}
                style={{
                  data: {fill: "#FD9821"},
                }}
                //data={blocks.map(blockMapGasUsedPerTx)} 
                data={gasUsedPerTxChartData(blocks, blockMapGasUsedPerTx)}
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
                  tickValues={[1000000, 2000000, 3000000, 4000000, 5000000]}
                  style={{
                    axis: {stroke: 'transparent'},
                    tickLabels: {fontSize: 10, fill: "transparent"}
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
      <div className="chart-item">
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
