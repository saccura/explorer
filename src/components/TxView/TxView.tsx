import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { Table, TableBody, TableCell, TableRow, Typography, Button } from "@material-ui/core";
import { hexToNumber } from "@etclabscore/eserialize";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const unit = require("ethjs-unit"); //tslint:disable-line

export interface ITxViewProps {
  tx: any;
  receipt: any | null;
}

function TxView(props: ITxViewProps) {
  const { tx, receipt } = props;
  const { t } = useTranslation();
  const history = useHistory();
  if (!tx) {
    return null;
  }

  return (
    <div className="transaction-view">
      <Typography className="tx-title" variant="h6">
        Transaction
        <Button
        onClick={() => {
          history.push(`/tx/${tx.hash}/raw`);
        }}
        className="view-raw"
        //style={{ position: "absolute", right: "10px", top: "75px" }}
      >View Raw</Button>
      </Typography>
      <div className="transaction-view__firsttable">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{t("Hash")}</TableCell>
              <TableCell>{tx.hash}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("Block")}</TableCell>
              <TableCell>
                <Link
                  component={({ className, children }: { children: any, className: string }) => (
                    <RouterLink className={className} to={`/block/${tx.blockHash}`} >
                      {children}
                    </RouterLink>
                  )}>
                  {tx.blockHash}
                </Link>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("Block Number")}</TableCell>
              <TableCell>{hexToNumber(tx.blockNumber)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("Gas")}</TableCell>
              <TableCell>{hexToNumber(tx.gas)}</TableCell>
            </TableRow>

            <TableRow className="gasprice">
              <TableCell className="gasprice-title">{t("Gas Price")}</TableCell>
              {/* <TableCell className="gasprice-content">{hexToNumber(tx.gasPrice)</TableCell> */}
              <TableCell className="gasprice-content">{unit.fromWei(tx.gasPrice, "ether")}</TableCell>
            </TableRow>

            <TableRow className="value">
              <TableCell className="value-title">{t("Value")}</TableCell>
              <TableCell className="value-content">{unit.fromWei(tx.value, "ether")}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("From")}</TableCell>
              <TableCell>
                <Link
                  component={({ className, children }: { children: any, className: string }) => (
                    <RouterLink className={className} to={`/address/${tx.from}`} >
                      {children}
                    </RouterLink>
                  )}>
                  {tx.from}
                </Link>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("To")}</TableCell>
              <TableCell>
                {tx.to !== null ?
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/address/${tx.to}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {tx.to}
                  </Link>
                  : null
                }
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("Nonce")}</TableCell>
              <TableCell>{hexToNumber(tx.nonce)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("Transaction Index")}</TableCell>
              <TableCell>{hexToNumber(tx.transactionIndex)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("Input")}</TableCell>
              <TableCell>{tx.input}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>v</TableCell>
              <TableCell>{tx.v}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>r</TableCell>
              <TableCell>{tx.r}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>s</TableCell>
              <TableCell>{tx.s}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Typography className="receipt-title" variant="h6">Receipt</Typography>
      {receipt &&
        <div className="transaction-view__secondtable">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>{t("Hash")}</TableCell>
                <TableCell>{receipt.transactionHash}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Block")}</TableCell>
                <TableCell>
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/block/${receipt.blockHash}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {receipt.blockHash}
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Block Number")}</TableCell>
                <TableCell>{hexToNumber(receipt.blockNumber)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Gas Used")}</TableCell>
                <TableCell>{hexToNumber(receipt.gasUsed)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Cumulative Gas Used")}</TableCell>
                <TableCell>{hexToNumber(receipt.cumulativeGasUsed)}Wei</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Value")}</TableCell>
                <TableCell>{unit.fromWei(tx.value, "ether")} POPX</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("From")}</TableCell>
                <TableCell>
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/address/${receipt.from}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {receipt.from}
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("To")}</TableCell>
                <TableCell>
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/address/${receipt.to}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {receipt.to}
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Contract Address")}</TableCell>
                <TableCell>
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/address/${receipt.contractAddress}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {receipt.contractAddress}
                  </Link>
                  {!receipt.contractAddress && "none"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Transaction Index")}</TableCell>
                <TableCell>{hexToNumber(receipt.transactionIndex)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Receipt Status")}</TableCell>
                <TableCell>{receipt.status}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("Receipt Logs")}</TableCell>
                <TableCell>
                  {receipt.logs.length}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      }
    </div>
  );
}

export default TxView;
