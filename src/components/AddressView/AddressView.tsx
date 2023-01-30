import * as React from "react";
import { Typography, Card, CardContent } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export interface IAddressViewProps {
  address: string;
  balance: string;
  txCount: number;
  code: string;
  className: string
}

function AddressView(props: IAddressViewProps) {
  const { address, balance, txCount, code, className } = props;
  const { t } = useTranslation();
  return (
    <Card className={className}>
      <CardContent className="view-wrapper">
        <div className="view-address">
          <h6 className="view-address__title">{t("Address")}:</h6>
          <div className="view-address__content content">{address}</div>
        </div>
        <div className="view-balancewithtxs">
          <div className="view-balancewithtxs__left">
            <h6 className="view-balancewithtxs__title">
              {t("Balance")}:
            </h6>
            <div className="view-balancewithtxs__content content">
              {balance} POPX
            </div>
          </div>
          <div className="view-balancewithtxs__right">
            <h6 className="view-balancewithtxs__title">
              {t("Transactions")}:
            </h6> 
            <div className="view-balancewithtxs__content content">
              {txCount}
            </div>
          </div>
        </div>
        <div className="view-code">
          <div className="view-code__title">{t("Code")}</div>
          <div className="view-code__content content">
            {code}
            {/* <code>{code}</code> */}
            {/* 0x608060405234801561001057600080fd5b50600436106102825760003560e01c80637e7aa62e116101585780637e7aa62e146104735780638979c87c1461047b5780638da7ad2314610483578063909a2ff6146104d857806395d89b41146104e0578063962ca496146104e857806399202454146104f05 */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AddressView;
