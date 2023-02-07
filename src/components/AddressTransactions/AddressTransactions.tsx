import * as React from "react";
import { Typography, IconButton, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import TxList from "../TxList";
import { ArrowBackIos, ArrowForwardIos, KeyboardBackspace } from "@material-ui/icons";
import { Transaction } from "@etclabscore/ethereum-json-rpc";
import TableScrollCustomize from "../TableScrollCustomize";
import { useWindowSize } from "usehooks-ts";

export interface IProps {
  transactions: Transaction[];
  from: number;
  to: number;
  disableNext?: boolean;
  disablePrev?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  style?: any;
  className: string
}

const AddressTransactions: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { width } = useWindowSize()

  return (
    <div className={props.className} style={props.style}>
      <div className="transactions-top">
        <Grid className="transactions-top__blockrange">
          <Typography>Showing block range: {props.to} - {props.from}</Typography>
        </Grid>
        <Grid className="transactions-top__arrows">
          {/* <IconButton className="" onClick={props.onPrev} disabled={props.disablePrev}>
            <ArrowBackIos />
          </IconButton>
          <IconButton onClick={props.onNext} disabled={props.disableNext}>
            <ArrowForwardIos />
          </IconButton> */}
          <IconButton className={`left-button ${props.disablePrev ? '' : 'active'}`} onClick={props.onPrev} disabled={props.disablePrev}/>
          <IconButton className={`right-button ${props.disableNext ? '' : 'active'}`} onClick={props.onNext} disabled={props.disableNext}/>
        </Grid>
      </div>
      <TableScrollCustomize
          mainTableWrapperClass="transactions-bottom"
          //scrollChildContentWidth={1736} 
          scrollChildContentHeight={20} 
          scrollWrappertranslateY={width < 768 ? 67 : 85}
          scrollWrapperMargin="0px 0px 0px 24px"
        >
        <div className="transactions-bottom">
          {/* <TxList transactions={transactions || []} showBlockNumber={true}></TxList> */}

            <TxList transactions={props.transactions || []} showBlockNumber={true}></TxList>
          {/* {(!props.transactions || props.transactions.length === 0) &&
            <Grid className="empty-transactions" container style={{ padding: "15px" }}>
              <Typography>{t("No Transactions for this block range.")}</Typography>
            </Grid>
          } */}

          {/* {
          transactions.length ? <TxList transactions={transactions || []} showBlockNumber={true}></TxList>
          : <Grid className="empty-transactions" container style={{ padding: "16px" }}>
              <Typography>{t("No Transactions for this block range.")}</Typography>
            </Grid>
          } */}

        </div>
      </TableScrollCustomize>


    </div>
  );
};

export default AddressTransactions;
