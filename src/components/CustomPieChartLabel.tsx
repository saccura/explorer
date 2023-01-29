import React from "react";
import { VictoryTooltip } from "victory";
function tooltipTextBuilder (text: string, appendValue: string) {
  let ndx = 0
  const newLineNdx = [14, 28]
  let resultStr = ''
  while(ndx !== 42) {
    if( newLineNdx.includes(ndx) ) {
      resultStr = resultStr + text[ndx] + "\n"
    } else {
      resultStr = resultStr + text[ndx]
    }

    ndx++
  }

  resultStr = resultStr + appendValue

  return resultStr
}
class CustomPieChartLabel extends React.Component {
  public static defaultEvents = (VictoryTooltip as any).defaultEvents;
  public render() {
    return (
      <>
        {/* {(this.props as any).defaultActive &&
          <VictoryTooltip
            {...(this.props as any)}
            // active={(this.props as any).defaultActive &&
            //   (this.props as any).defaultActive.x === (this.props as any).datum.x}
            text={`${(this.props as any).datum.x}\n${(this.props as any).datum.y}`}
            cornerRadius={5}
            height={40}
            flyoutStyle={{
              stroke: "none",
            }}
            center={{x: 225, y: 0}}
            flyoutWidth={137}
          />
        } */}
        <VictoryTooltip
          {...(this.props as any)}
          // active={(this.props as any).defaultActive &&
          //   (this.props as any).defaultActive.x === (this.props as any).datum.x}
          width={100}
          //text={`${(this.props as any).datum.x}\n${(this.props as any).datum.y}`}
          text={tooltipTextBuilder((this.props as any).datum.x, (this.props as any).datum.y)}
          // x={(this.props as any).width / 2}
          // y={(this.props as any).y + 15}
          // orientation="bottom"
          // pointerLength={0}
          cornerRadius={8}
          center={{x: 300, y: 127.5}}
          height={40}
          flyoutStyle={{
            stroke: "none",
          }}
        />
      </>
    );
  }
}

export default CustomPieChartLabel;
