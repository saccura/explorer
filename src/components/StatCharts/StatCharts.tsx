import React from "react";
import BigNumber from "bignumber.js";
import { hashesToGH } from "../formatters";
import { hexToNumber } from "@etclabscore/eserialize";
import { Grid } from "@material-ui/core";
import ChartCard from "../ChartCard";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";
import { useTranslation } from "react-i18next";

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
      <Grid className="chart-item">
        <ChartCard title={t("Transaction count")}>
          <VictoryChart height={config.chartHeight} width={config.chartWidth}>
            <VictoryBar
              //containerComponent={<VictoryContainer responsive={false}/>}
              barWidth={4}
              cornerRadius={2}
              style={{
                data: {fill: "#3772FF", padding: 11, stroke: 'red'},
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
      </Grid>
      <Grid className="chart-item" key="gasUsed" item>
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
        <Grid className="chart-item" key="gasUsedPerTx" item>
          <ChartCard title={t("Gas Used per Tx")}>
            <VictoryChart height={config.chartHeight} width={config.chartWidth}>
              <VictoryBar
              barWidth={4}
              cornerRadius={2}
              padding={{left: 2, right: 2}}
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
      <Grid className="chart-item">
            {minerChart}
      </Grid>
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
