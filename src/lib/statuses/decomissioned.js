import React from 'react';
import { gql } from 'apollo-boost';

const query = gql`
    query ServiceNodeByStatus($status: DECOMISSIONED, $offset: Int, $limit: Int) {
        serviceNodes(status: $status, offset: $offset, limit: $limit) {
        id
        publicKey
        active
        status 
        operatorFee
        registrationHeight {
        height
        heightDate
        }
        lastRewardBlockHeight {
        height
        heightDate
        rewardToSn
        }
    }
    }
`;


const Table = <></>;
