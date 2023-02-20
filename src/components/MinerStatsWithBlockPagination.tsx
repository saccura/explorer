import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
// import ChartCard from "./ChartCard";
import { VictoryContainer, VictoryLabel, VictoryPie } from "victory";
//import { hexToString } from "@etclabscore/eserialize";
import CustomPieChartLabel from "./CustomPieChartLabel";
import { useTranslation } from "react-i18next";
import _ from "lodash";
// import MinerStats from "./MinerStats";
import BlockPagination from "./BlockPagination";
import { useWindowSize } from "usehooks-ts";


interface IProps {
    blocks: any[],
    from: number,
    to: number,
    disablePrev: boolean
    disableNext: boolean,
    config: {},
    onPrev: () => void,
    onNext: () => void
}
const blockTopMinerCountByAddress = (blocks: any[]) => {
    const result = _(blocks).chain()
      .countBy((b: any) => b.miner)
      .map((key: string, val: number) => ({
        x: val,
        y: key,
        label: val,
      }))
      .sortBy((item: any) => item.y)
      .reverse()
      .value();
    return result;
  };


interface ChartMutation {
  externalMutations: undefined | {}[]
}

const MinerStatsWithBlockPagination: React.FC<IProps> = ({blocks, config, from, to, disablePrev, disableNext, onPrev, onNext}) => {
  //const [showDefaultPieHover, setShowDefaultPieHover] = useState(true);
  const [activeAddress, setActiveAddress] = useState("");
  const [eventMutation, setEventMutation] = useState<ChartMutation>({externalMutations: undefined});
  const [eventKey, setEventKey] = useState(-1)
  const { width } = useWindowSize()
  const { t } = useTranslation();


  const removeMutation = () => {
    setEventMutation({externalMutations: undefined})
  }

  const clearClicks = (eventKey: number) => {
    setEventMutation({
      externalMutations: [
        {
          target: ["data"],
          eventKey: [eventKey],
          mutation: () => ({ padAngle: 0, radius: 75 }),
          callback: removeMutation
        }
      ]
    });
  }
  
  const calcPieChartPosition = (resolution: number) => {
    if(resolution < 768) {
      return "translate(-49px, -52px)" 
    } else if(width >= 1920) {
      return "translate(-67px, -15px)"
    } else if(width >= 1280) {
      return "translate(-50px, -20px)"
    } else if (width >= 768) {
      return "translate(-43px, -50px)"
    }
  } 

  return (
    <Grid container className="miner-stat">
      <Grid key="uncles-address" item>
          <div className="miner-info">
            <h6 className="MuiTypography-root MuiTypography-h6">{t("Miners by address")}</h6>
              <div className="miner-pagination">
                  <BlockPagination
                      from={from}
                      to={to}
                      disablePrev={disablePrev}
                      disableNext={disableNext}
                      onPrev={onPrev}
                      onNext={onNext}
                  ></BlockPagination>
              </div>
          </div>
          <VictoryPie
            containerComponent={<VictoryContainer responsive={false}/>}
            width={255}
            height={255}
            style={{
              parent: {transform: calcPieChartPosition(width) },
              data: {padding: 12}
            }}
            radius={75}
            // x={10}
            // y={10}
            colorScale={["#3772FF", "#BDD1FF"]}
            data={blockTopMinerCountByAddress(blocks)}
            //@ts-ignore
            externalEventMutations={eventMutation.externalMutations}
            events={[{
              target: "data",
              eventHandlers: {
                //onMouseOver
                onClick: () => {
                  return [
                    {
                      target: "data",
                      mutation: (props) => {
                        if(props.datum.x === activeAddress) {
                          setActiveAddress("")
                          setEventKey(-1)
                          return { padAngle: 0, radius: 75 }
                        }

                        clearClicks(eventKey)
                        setEventKey(props.index)
                        setActiveAddress(props.datum.x)

                        return { padAngle: 6, radius: 80 }
 
                      },
                    }
                  ];
                },
              },
            }]}
            // labelComponent={<CustomPieChartLabel {...{
            //   defaultActive: showDefaultPieHover ? blockTopMinerCountByAddress(blocks)[0] : undefined,
            // }} />}
            labelComponent={<VictoryLabel 
              //@ts-ignore
              style={[
                { fill: "transparent", },
              ]}
            />}
          >
          </VictoryPie>
          
          {activeAddress && <div 
              className="curAddress" 
              style={{
                width: width < 1280 ? "45%" : "61%",
                background: "#E6E8EC",
                transform: width < 1280 ? "translate(170px, -215px)" : "translate(174px, -173px)",
                wordBreak: "break-all",
                borderRadius: 8,
                padding: 8
              }}
              
              >
              {activeAddress}
            </div>}
      </Grid>
    </Grid>
  );
};

export default MinerStatsWithBlockPagination;
