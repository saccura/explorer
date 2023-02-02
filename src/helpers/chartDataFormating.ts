
export const numberWithCommas = (num: any) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const transactionCountChartData = (blocks: any, procesingCallback: Function) => {
    const processedChartData = blocks.map(procesingCallback).reduce((acc: any[], item: {x: number, y: number}, ndx: number): {x: string, y: number}[] => {
      acc.push({x: numberWithCommas( ((item.x / 1000) + ndx).toFixed()), y: item.y})
      return acc
    }, [] ).slice(0, 36)

    return processedChartData
}

export const gasUsedChartData = (blocks: any, procesingCallback: Function) => {
    const processedChartData = blocks.map(procesingCallback).reduce((acc: any[], item: {x: number, y: any}, ndx: number): {x: string, y: number}[] => {
      acc.push({x: numberWithCommas( ((item.x / 1000) + ndx).toFixed()), y: item.y})
      return acc
    }, [] ).slice(0, 36)

    return processedChartData
  }

export const gasUsedPerTxChartData = (blocks: any, procesingCallback: Function) => {
    const processedChartData = blocks.map(procesingCallback).reduce((acc: any[], item: {x: number, y: any}, ndx: number): {x: string, y: number}[] => {
      acc.push({x: numberWithCommas( ((item.x / 1000) + ndx).toFixed()), y: item.y})
      return acc
    }, [] ).slice(0, 36)

    return processedChartData
  }