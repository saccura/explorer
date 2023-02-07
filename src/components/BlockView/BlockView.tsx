import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import TxList from "../TxList";
import { hexToDate, hexToString, hexToNumber } from "@etclabscore/eserialize";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Table, TableBody, TableCell, TableRow, Button, LinearProgress, Typography } from "@material-ui/core";
import BlockGasPrice from "./BlockGasPrice";

function BlockView(props: any) {
  const { block } = props;
  const history = useHistory();
  const { t } = useTranslation();

  if (!block) {
    return (<div>Loading...</div>);
  }

  const {
    timestamp, hash, parentHash, miner, nonce, difficulty,
    extraData, stateRoot, transactionsRoot, receiptsRoot, transactions,
    gasUsed, gasLimit, size, baseFeePerGas
  } = block;

  const filledPercent = (hexToNumber(gasUsed) / hexToNumber(gasLimit)) * 100;
  return (
    <div className="block-view">
      <Button
        onClick={() => { history.push(`/block/${block.hash}/raw`); }}
        //style={{ position: "absolute", right: "10px", top: "75px" }}
        className="view-raw"
      >
      View Raw
      </Button>
      {/* <div className="top">
        <Button
          onClick={() => { history.push(`/block/${block.hash}/raw`); }}
          style={{ position: "absolute", right: "10px", top: "75px" }}
          className="view-raw"
        >
          View Raw
        </Button>
      </div> */}
      <div className="bottom">
        <div className="table-wrapper">
          <Table className="blockinfo-table">
            <TableBody>
              <TableRow>
                <TableCell>{t("Number")}</TableCell>
                <TableCell className="block-view__number">{hexToNumber(block.number)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Gas Usage")}</TableCell>
                <TableCell className="block-view__gasusage">
                  <Typography variant="caption">
                    {hexToNumber(gasUsed)}/{hexToNumber(gasLimit)}
                  </Typography>
                  <LinearProgress
                    style={{width: "150px"}}
                    value={filledPercent}
                    variant="determinate"
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Timestamp")}</TableCell>
                <TableCell>
                  {t("Timestamp Date", { date: hexToDate(timestamp) })}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Hash")}</TableCell>
                <TableCell>{hash}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="block-view__parenthash title">{t("ParentHash")}</TableCell>
                <TableCell className="block-view__parenthash value">
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/block/${parentHash}`}>
                        {children}
                      </RouterLink>
                    )}>
                    {parentHash}
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="block-view__collator title">{t("Collator")}</TableCell>
                <TableCell className="block-view__collator value">
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/address/${miner}`}>
                        {children}
                      </RouterLink>
                    )}>
                    {miner}
                  </Link>
                </TableCell>
              </TableRow>

              <BlockGasPrice block={block} />

              <TableRow>
                <TableCell>{t("Gas Limit")}</TableCell>
                <TableCell>{hexToNumber(gasLimit)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Size")}</TableCell>
                <TableCell>{hexToNumber(size)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Nonce")}</TableCell>
                <TableCell>{hexToNumber(nonce)}</TableCell>
              </TableRow>

              {/* <TableRow>
                <TableCell>{t("Difficulty")}</TableCell>
                <TableCell>{hexToNumber(difficulty)}</TableCell>
              </TableRow> */}

              {/* <TableRow>
                <TableCell>{t("Extra Data")}</TableCell>
                <TableCell>{hexToString(extraData)}</TableCell>
              </TableRow> */}

              <TableRow>
                <TableCell>{t("State Root")}</TableCell>
                <TableCell>{stateRoot}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Transaction Root")}</TableCell>
                <TableCell>{transactionsRoot}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Receipts Root")}</TableCell>
                <TableCell>{receiptsRoot}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <TxList transactions={transactions} />
        </div>
      </div>

    </div>
  );
}

export default BlockView;
