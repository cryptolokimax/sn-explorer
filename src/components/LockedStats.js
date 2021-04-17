import React, { useState } from "react";
import { Box, Chart, Text, Stack } from "grommet";
import { LineChart, XAxis, Legend, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import moment from "moment";
import NumberFormat from "react-number-format";

import styled from "styled-components";
import _ from "lodash";

import useResponsive from "../lib/useResponsive";

const formatXAxis = (tickItem) => moment(tickItem).format("YYYY-MM-DD")

const formatYAxisLockedUSD = (tickItem) => `$${Math.round(parseFloat(tickItem) / 1000000)}m`

const formatYAxisLockedCircSupply = (tickItem) => `${tickItem}%`

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {

        const {
            heightDate,
            lockedCircSupply,
            lockedUSD
        } = payload[0].payload;

        return (
            <Box
                animation={{ type: "fadeIn", duration: 100 }}
                pad="medium"
                background={{ color: "white", opacity: "strong" }}
                border={{ color: "accent-2" }}
                round
            >
                <Text size="large" weight="bold">
                    {moment(heightDate).format("MMM Do YYYY")}
                </Text>
                <Text size="small">
                    Locked: {lockedCircSupply}%
                </Text>
                <Text size="small">
                    Locked, USD: <NumberFormat value={Math.round(lockedUSD)} displayType="text" thousandSeparator />
                </Text>
            </Box>
        );
    }

    return null;
};

const LockedStats = ({ lockedStats }) => {
    const r = useResponsive();

    return (
        <Box direction="row" width="100%" height="500px">
            <LineChart
                width={650}
                height={500}
                data={lockedStats}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <XAxis style={{ fill: 'rgba(0, 0, 0)' }} textAnchor="end" height={80} dataKey="heightDate" angle={-45} tickFormatter={formatXAxis} />
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid stroke="#f5f5f5" />
                <Legend verticalAlign="top" height={36} />
                <YAxis axisLine={false} style={{ fill: 'rgba(0, 0, 0)' }} /* label={{ value: 'Locked circ. supply, %', angle: -90, position: 'insideLeft' }}*/ yAxisId={0} tickFormatter={formatYAxisLockedCircSupply} />
                <YAxis axisLine={false} style={{ fill: 'rgba(0, 0, 0)' }} /* label={{ value: 'Locked, USD', angle: -90, position: 'insideTopRight' }}*/ yAxisId={1} orientation="right" tickFormatter={formatYAxisLockedUSD} />
                <Line type="monotone" dot={false} dataKey="lockedCircSupply" stroke="#00C781" yAxisId={0} />
                <Line type="monotone" dot={false} dataKey="lockedUSD" stroke="#FD6FFF" yAxisId={1} />
            </LineChart>
        </Box>

    );
};

export default LockedStats;
