import React from "react";

const Address = ({ address, type = 'node' }) => {
    return (
        <span>{`${address.substr(0,8)}…${address.substr(-4)}`}</span>
    );
}
    
export default Address;