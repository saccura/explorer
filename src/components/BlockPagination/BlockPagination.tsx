
import React from "react";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { KeyboardBackspace } from "@material-ui/icons";

interface IProps {
  from: number;
  to: number;
  disableNext?: boolean;
  disablePrev?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  style?: any;
}

const BlockPagination: React.FC<IProps> = (props) => {
  return (
    <Grid className="block-pagination" container>
      <Grid container justify="flex-end">
        <button className={`left-button ${props.disablePrev ? '' : 'active'}`} onClick={props.onPrev} disabled={props.disablePrev}></button>
        <button className={`right-button ${props.disableNext ? '' : 'active'}`} onClick={props.onNext} disabled={props.disableNext}></button>
      </Grid>
      <Grid className="showing" container justify="flex-end">
        <Typography>Showing {(props.to - props.from) + 1} Block Range: <b>{props.to}</b> - <b>{props.from}</b></Typography>
      </Grid>
    </Grid>
  );
};

export default BlockPagination;
