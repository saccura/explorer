import { VictoryContainer } from "victory";

export const numberWithCommas = (num: any) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const transactionCountChartData = (
  blocks: any,
  procesingCallback: Function,
  sliceCount = 36
) => {
  const maxYaxisValue = 29;
  const processedChartData = blocks
    .map(procesingCallback)
    .reduce(
      (
        acc: any[],
        item: { x: number; y: number },
        ndx: number
      ): { x: string; y: number }[] => {
        acc.push({
          x: numberWithCommas((item.x / 1000 + ndx).toFixed()),
          y: item.y,
        });

        return acc;
      },
      []
    )
    .filter((item: any) => Number(String(item.y)) <= maxYaxisValue && Number(String(item.y)) > 0)
    .slice(0, sliceCount);
// .filter((item: any) => Number(String(item.y)) <= maxYaxisValue)
  return processedChartData;
};

export const gasUsedChartData = (
  blocks: any,
  procesingCallback: Function,
  sliceCount = 36
) => {
  const maxYaxisValue = 2.2;
  const processedChartData = blocks
    .map(procesingCallback)
    .reduce(
      (
        acc: any[],
        item: { x: number; y: any },
        ndx: number
      ): { x: string; y: number }[] => {
        acc.push({
          x: numberWithCommas((item.x / 1000 + ndx).toFixed()),
          y: item.y,
        });

        return acc;
      },
      []
    )
    .filter((item: any) => Number(String(item.y)) <= maxYaxisValue && Number(String(item.y)) > 0)
    .slice(0, sliceCount);

  return processedChartData;
};

export const gasUsedPerTxChartData = (
  blocks: any,
  procesingCallback: Function,
  sliceCount = 36
) => {
  const maxYaxisValue = 1800000;
  const processedChartData = blocks
    .map(procesingCallback)
    .reduce(
      (
        acc: any[],
        item: { x: number; y: any },
        ndx: number
      ): { x: string; y: number }[] => {
        acc.push({
          x: numberWithCommas((item.x / 1000 + ndx).toFixed()),
          y: item.y,
        });
        return acc;
      },
      []
    )
    .filter((item: any) => Number(String(item.y)) <= maxYaxisValue && Number(String(item.y)) > 0)
    .slice(0, sliceCount);

  return processedChartData;
};

export const victoryBarDynamicProps = (resolution: number) => {
  const isMobile: boolean = resolution < 768 ? true : false;

  return {
    barWidth: isMobile ? 15 : 6,
    cornerRadius: isMobile ? 7 : 3,
  };
};

export const calcChartDataCount = (resolution: number, custom = 0) => {
  if(custom) {
    return custom
  }
  if (resolution < 768) {
    return 32;
  }
  if (resolution >= 1900) {
    return 52;
  }
  return 100;
};