import React from 'react';
import { Button } from 'grommet';
import NumberFormat from 'react-number-format';
import Floater from 'react-floater';
import useClipboard from 'react-use-clipboard';
import useResponsive from '../lib/useResponsive';

const Amount = ({ amount, metric = ' LOKI', decimalScale = 2 }) => {
  const amountWithPrecision = amount && amount.toFixed(9).replace(/\.?0+$/, '');
  const [isCopied, setCopied] = useClipboard(amountWithPrecision);
  const r = useResponsive();

  const numOfDecimals = amountWithPrecision && amountWithPrecision.toString() && amountWithPrecision.toString().split('.') && amountWithPrecision.toString().split('.').length > 1 ? amountWithPrecision.toString().split('.')[1].length : 0;

  return numOfDecimals > 2 ? (
    <Floater
      event="hover"
      content={(
        <div style={{
          fontSize: 20,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
        >
          {amountWithPrecision}
          <br />
          <span style={{ fontSize: 14 }}>(click to copy)</span>
        </div>
)}
      styles={{
        floater: {
          maxWidth: 900,
        },
        container: {
          backgroundColor: '#00C781',
          color: '#fff',
          minHeight: 25,
        },
        arrow: {
          color: '#00C781',
        },

      }}
    >
      <Button onClick={setCopied}><NumberFormat value={amount} displayType="text" thousandSeparator decimalScale={decimalScale} suffix={metric} /></Button>
    </Floater>
  ) : <NumberFormat value={amount} displayType="text" thousandSeparator decimalScale={decimalScale} suffix={metric} />;
};

export default Amount;
