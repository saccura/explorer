import React, { useState } from "react";
import { Grid } from "@material-ui/core";
// import ChartCard from "./ChartCard";
import { VictoryContainer, VictoryPie } from "victory";
//import { hexToString } from "@etclabscore/eserialize";
import CustomPieChartLabel from "./CustomPieChartLabel";
import { useTranslation } from "react-i18next";
import _ from "lodash";
// import MinerStats from "./MinerStats";
import BlockPagination from "./BlockPagination";


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




interface ChartMutationState {
  externalMutations: undefined | [object]
}

const MinerStatsWithBlockPagination: React.FC<IProps> = ({blocks, config, from, to, disablePrev, disableNext, onPrev, onNext}) => {
  const [showDefaultPieHover, setShowDefaultPieHover] = useState(true);
  const [chartMutationState, setChartMutationState] = useState<ChartMutationState>({externalMutations: undefined});
  const { t } = useTranslation();


  const removeMutation = () => {
    setChartMutationState({
      externalMutations: undefined
    });
  }
  const clearSliceMutation = () => {
    setChartMutationState({
      externalMutations: [
        {
          //childName: "miner-pie",
          target: ["data"],
          eventKey: "all",
          mutation: () => ({ padAngle: 0 }),
          callback: removeMutation
        }
      ]
    })
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
            name="miner-pie"
            containerComponent={<VictoryContainer responsive={false}/>}
            // innerRadius={50}
            width={255}
            height={255}
            style={{
              parent: {transform: "translate(-50px, -50px)"},
              data: {padding: 12}
            }}
            // padAngle={(props) => {
            //   console.log(props.datum.endAngle === chartSliceIndex)
            //   //console.log(props)
            //   return 2
            // }}
            // x={10}
            // y={10}
            colorScale={["#3772FF", "#BDD1FF"]}
            data={blockTopMinerCountByAddress(blocks)}
            // @ts-ignore
            externalEventMutations={chartMutationState.externalMutations}
            events={[{
              target: "data",
              eventHandlers: {
                //onMouseOver
                onClick: () => {
                  return [
                  // {
                  //   target: "labels",
                  //   mutation: (props) => {
                  //     //setShowDefaultPieHover(false);
                  //     //return { active: true };
                  //     //console.log("prop: ", props)
                  //     setShowDefaultPieHover((prev) => !prev);
                  //     return { active: !props.active};
                  //   },
                  // },
                  //mutation: (props) => ({ style: Object.assign({}, props.style, { fill: "gold" }) })
                {
                  target: "data",
                  mutation: (props) => {
                    props.padAngle = 4
                    return { ...props }
                  },
                }];
                },

              },
            }]}
            labelComponent={<CustomPieChartLabel {...{
              defaultActive: showDefaultPieHover ? blockTopMinerCountByAddress(blocks)[0] : undefined,
              
            }} />}
          >
          </VictoryPie>
      </Grid>
    </Grid>
  );
};

export default MinerStatsWithBlockPagination;
