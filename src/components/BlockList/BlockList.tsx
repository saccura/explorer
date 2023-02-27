import { Table, TableBody, TableCell, TableHead, TableRow, Typography, LinearProgress, Tooltip } from "@material-ui/core";
import * as React from "react";
import Link from "@material-ui/core/Link";
import { hexToDate, hexToNumber, hexToString } from "@etclabscore/eserialize";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

// const rightPaddingFix = {
//   paddingRight: "24px",
// };
function BlockList({ blocks }: any) {
  const { t } = useTranslation();

  if (!blocks) {
    return null;
  }
  const sortedBlocks = blocks.sort((a: { number: number }, b: { number: number }) => {
    return b.number - a.number;
  });
  return (
    <div className="table-wrapper"
    //style={{ width: "100%", overflowX: "auto" }}
    >
      <Table>
        <TableHead>
            <TableRow>
              <TableCell><Typography>{t("Author")}</Typography></TableCell>
              <TableCell><Typography>{t("Block Number")}</Typography></TableCell>
              <TableCell><Typography>{t("Timestamp")}</Typography></TableCell>
              <TableCell><Typography>{t("#Txs")}</Typography></TableCell>
              <TableCell><Typography>{t("Gas Usage")}</Typography></TableCell>
              <TableCell><Typography>{t("Gas Limit")}</Typography></TableCell>
              {/* <TableCell><Typography>{t("Uncles")}</Typography></TableCell> */}
              <TableCell><Typography>{t("Hash")}</Typography></TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {sortedBlocks.map((b: any, index: number) => {
            const filledPercent = (hexToNumber(b.gasUsed) / hexToNumber(b.gasLimit)) * 100;
            // Shorten hash views by concatenating first and last 4 chars.
            const blockHashShort = b.hash.substring(2, 6) +
              "—" + b.hash.substring(b.hash.length - 5, b.hash.length - 1);
            const authorHashShort = b.miner.substring(2, 6) + "-" +
              b.miner.substring(b.miner.length - 5, b.miner.length - 1);
            // Colorize left border derived from author credit account.
            // const authorHashStyle = {
            //   //borderLeft: `6px solid #${b.miner.substring(2, 8)}`,
            //   borderLeft: `6px solid ${colors[index]}`,
            // };

            // Tally transactions which create contracts vs transactions with addresses.
            const txTypes = {
              create: 0,
              transact: 0,
            };

            b.transactions.forEach((tx: any) => {
              if (tx.to !== null) {
                txTypes.transact++;
              } else {
                txTypes.create++;
              }
            });

            // Calculate difference of block timestamp from that of parent.
            let tdfp;

            if (index === sortedBlocks.length - 1) {
              tdfp = 0;
            } else {
              tdfp = hexToNumber(b.timestamp) -
                hexToNumber(sortedBlocks[index + 1].timestamp);
            }

            return (
              <TableRow
              key={b.number}
              className={`tr-indent-${index}`}
              //style={authorHashStyle}
              >
                <TableCell className={`td-label-${index}`}>
                    <Link
                      component={({ className, children }: { children: any, className: string }) => (
                        <RouterLink className={className} to={`/address/${b.miner}`} >
                          {children}
                        </RouterLink>
                      )}>
                      {authorHashShort}
                    </Link>
                    {/*&nbsp;<sup>{hexToString(b.extraData).substring(0, 20)}</sup>*/}
                </TableCell>
                <TableCell scope="row">
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/block/${b.hash}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {parseInt(b.number, 16)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography style={{color: "#18B04D"}}>{t("Timestamp Date", { date: hexToDate(b.timestamp) })}
                    &nbsp;<sub>({tdfp > 0 ? `+${tdfp}` : `-${tdfp}`}s)</sub>
                  </Typography>
                  {/* <Typography style={{color: "#18B04D"}}>
                    Date (+12s)
                  </Typography> */}
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={t("Create Transactions", {count: txTypes.create}) as string}
                    placement="top"
                  >
                    <Typography variant="caption" color="textSecondary">
                      {txTypes.create === 0 ? "" : txTypes.create}
                    </Typography>
                  </Tooltip>
                  <Typography style={{color: "#18B04D"}}>
                    {txTypes.transact}
                  </Typography>
                </TableCell>
                <TableCell>
                  <LinearProgress style={{
                    width: "90%",
                    height: 6,
                    borderRadius: 100
                  }} value={filledPercent} variant="determinate" />
                </TableCell>
                <TableCell>
                  <Typography style={{color: "#18B04D"}}>
                    {hexToNumber(b.gasLimit)}
                  </Typography>
                </TableCell>
                {/* <TableCell>
                  <Typography>{b.uncles.length === 0 ? "" : b.uncles.length}</Typography>
                </TableCell> */}
                <TableCell>
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/block/${b.hash}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {blockHashShort}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>


  );
}

export default BlockList;
