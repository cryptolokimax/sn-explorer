import React from "react"
import { DataTable } from 'grommet'
import moment from 'moment'
const SwarmHistories = ({ swarmHistories }) => {

    const swarmData = swarmHistories.map( r=> ({
        swarm: r.swarm && r.swarm.swarmId,
        date: moment(r.createdAt).format("MMM Do YYYY, h:mm:ss a")
    }))
    return (
        <DataTable
            columns={[
                {"header":"Date","property":"date","primary":true},
                {"header":"Swarm ID","property":"swarm"}
            ]} 
            data={swarmData}
        />
    );
}

export default SwarmHistories;