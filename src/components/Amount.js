import React from 'react';
import NumberFormat from 'react-number-format';

const Amount = ({ amount, metric = ' LOKI', decimalScale = 2 }) => (
  <NumberFormat value={amount} displayType="text" thousandSeparator decimalScale={decimalScale} suffix={metric} />
);

export default Amount;
