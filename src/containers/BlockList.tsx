import { CircularProgress, Grid, IconButton } from "@material-ui/core";
import useEthRPCStore from "../stores/useEthRPCStore";
import * as React from "react";
import BlockList from "../components/BlockList";
import getBlocks from "../helpers";
import { ArrowForwardIos, ArrowBackIos } from "@material-ui/icons";
import { Block as IBlock } from "@etclabscore/ethereum-json-rpc";
import TableScrollCustomize from "../components/TableScrollCustomize";
import { useWindowSize } from "usehooks-ts";


interface IProps {
  from: number;
  to: number;
  disablePrev: boolean;
  disableNext: boolean;
  style?: any;
  onNext?: any;
  onPrev?: any;
}

export default function BlockListContainer(props: IProps) {
  const { from, to, style } = props;
  const [erpc] = useEthRPCStore();
  const [blocks, setBlocks] = React.useState<IBlock[]>();
  const { width } = useWindowSize()

  React.useEffect(() => {
    if (!erpc) { return; }
    getBlocks(from, to, erpc).then(setBlocks);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  if (!blocks) {
    return <div className="curcular-wrapper"><CircularProgress /></div>;
  }
  return (
    <TableScrollCustomize 
      mainTableWrapperClass="table-wrapper"
      //scrollChildContentWidth={1736} 
      scrollChildContentHeight={20} 
      scrollWrappertranslateY={width < 768 ? 48 : 45}
      scrollWrapperMargin="0px 32px"
    >
    <div className="table">
      {/* <Grid container justify="flex-end">
        <IconButton onClick={props.onPrev} disabled={props.disablePrev}>
          <ArrowBackIos />
        </IconButton>
        <IconButton onClick={props.onNext} disabled={props.disableNext}>
          <ArrowForwardIos />
        </IconButton>
      </Grid> */}
      <BlockList blocks={blocks} />
    </div>
    </TableScrollCustomize>
  );
}
