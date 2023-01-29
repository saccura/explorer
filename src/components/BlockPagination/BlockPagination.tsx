
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
    <Grid container>
      <Grid container justify="flex-end">
        <IconButton className={`left-button ${props.disablePrev ? '' : 'active'}`} onClick={props.onPrev} disabled={props.disablePrev}>
          <KeyboardBackspace />
        </IconButton>
        <IconButton className={`right-button ${props.disableNext ? '' : 'active'}`} onClick={props.onNext} disabled={props.disableNext}>
          <KeyboardBackspace />
        </IconButton>
      </Grid>
      <Grid container justify="flex-end">
        <Typography>Showing {(props.to - props.from) + 1} Block Range: <b>{props.to}</b> - <b>{props.from}</b></Typography>
      </Grid>
    </Grid>
  );
};

export default BlockPagination;
