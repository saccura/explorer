import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { hexToNumber } from "@etclabscore/eserialize";

function TxListItem({ tx, showblockNumber }: { tx: any, showblockNumber?: boolean}) {

  return (
    <TableRow>
      {showblockNumber && <TableCell>{typeof tx.blockNumber === "number" ? tx.blockNumber : hexToNumber(tx.blockNumber)}</TableCell>}

      <TableCell>
        <Link
          component={({ className, children }: { children: any, className: string }) => (
            <RouterLink to={`/tx/${tx.hash}`} >
              {children}
            </RouterLink>
          )}>
          {tx.hash}
        </Link>
      </TableCell>

      <TableCell>
        <Link
          component={({ className, children }: { children: any, className: string }) => (
            <RouterLink to={`/address/${tx.from}`} >
              {children}
            </RouterLink>
          )}>
          {tx.from}
        </Link>
      </TableCell>

      <TableCell>
        {tx.to !== null ?
          <Link
            component={({ className, children }: { children: any, className: string }) => (
              <RouterLink to={`/address/${tx.to}`} >
                {children}
              </RouterLink>
            )}>
            {tx.to}
          </Link>
          : null}
      </TableCell>


      <TableCell>{typeof tx.transactionIndex === "number" ? tx.transactionIndex : hexToNumber(tx.transactionIndex)}</TableCell>
    </TableRow>
  );
}

export interface ITxListProps {
  transactions: any[];
  showBlockNumber?: boolean;
  excludeColumnIndex?: number
}

function TxList(props: ITxListProps) {
  return (
    <Table className="txlist-table">
      <TableHead>
        <TableRow>
          {props.showBlockNumber && <TableCell>Block Number</TableCell>}
          <TableCell>Hash</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell>Index</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {props.transactions.map(
          (tx: any) =>
            <TxListItem key={tx.hash} tx={tx} showblockNumber={props.showBlockNumber} />,
        )}
      </TableBody>
    </Table>
  );
}

export default TxList;
