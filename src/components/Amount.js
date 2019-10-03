import React from "react"
import NumberFormat from 'react-number-format'

const Amount = ({ amount, metric = " LOKI", decimalScale = 2 }) => {
    return (
        <NumberFormat value={amount} displayType={'text'} thousandSeparator={true} decimalScale={decimalScale} suffix={metric}/>
    );
}
    
export default Amount;