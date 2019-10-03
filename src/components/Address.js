import React from "react";
import { Heading, Button } from 'grommet'
import { Copy } from 'grommet-icons'
import { Link } from "react-router-dom"
import styled from 'styled-components'
import Floater from 'react-floater';
import useClipboard from "react-use-clipboard";

const CopyIcon = styled(Copy)`
    :hover {
        stroke: #000
    }
    :active {
        stroke: #666;
    }
`

const AddressLink = styled(Link)`
    text-decoration: none;
    cursor: pointer;
    color: #333;
    :hover {
        background-color: #efefef;
    }
`

const Address = ({ address, size="medium", type = 'node' }) => {
    const levels = {
        'medium': 4,
        'large': 1,
        'default': 4,
    }
    const margin = {
        'medium': 'x-small',
        'large': 'small',
        'default': 'x-small',
    }
    const [isCopied, setCopied] = useClipboard(address);
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                    <Heading level={levels[size] || levels['default']} margin={{"right": margin[size] || margin['default']}}>
                        <Floater
                            event="hover"
                            content={address}
                            styles={{
                                floater: {
                                    maxWidth: type === 'node' ? 900 : 1500,
                                },
                                container: {
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    minHeight: 25,
                                },
                                arrow: {
                                    color: '#000',
                                },
                                content: {
                                    fontSize: 20,
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                                }
                            }}
                        >
                            {type === 'node' ?
                                <AddressLink to={`/sn/${address}`}>{`${address.substr(0,8)}…${address.substr(-4)}`}</AddressLink>
                                :  `${address.substr(0,8)}…${address.substr(-4)}` }
                        </Floater>
                    </Heading>
            <Button onClick={setCopied} icon={<CopyIcon size={size} />} />
        </div>
    );
}
    
export default Address;