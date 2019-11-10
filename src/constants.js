import React from 'react';
import {
  Clock, Alert, Currency, StatusGood, Add, Hide, Clear, FormSubtract,
} from 'grommet-icons';

const constants = {
  statusColors: {
    REGISTERED: 'accent-1',
    AWAITING_CONTRIBUTION: 'accent-2',
    ACTIVE: 'status-ok',
    UNLOCK_REQUESTED: 'status-warning',
    DEREGISTERED_BY_UNLOCK: 'status-disabled',
    DECOMISSIONED: 'status-error',
    DEREGISTERED_BY_PENALTY: 'dark-2',
    UNKNOWN: 'status-unknown',
  },
  statusTexts: {
    REGISTERED: 'Registered',
    AWAITING_CONTRIBUTION: 'Awaiting contribution',
    ACTIVE: 'Active',
    UNLOCK_REQUESTED: 'Unlock requested',
    DEREGISTERED_BY_UNLOCK: 'Deregistered by unlock',
    DECOMISSIONED: 'Decomissioned',
    DEREGISTERED_BY_PENALTY: 'Deregistered by penalty',
    UNKNOWN: 'Unknown',
  },
  statucIcons: {
    REGISTERED: <Add color="light-1" />,
    AWAITING_CONTRIBUTION: <Currency color="light-1" />,
    ACTIVE: <StatusGood color="light-1" />,
    UNLOCK_REQUESTED: <Clock color="light-1" />,
    DEREGISTERED_BY_UNLOCK: <Hide color="light-1" />,
    DECOMISSIONED: <Alert color="light-1" />,
    DEREGISTERED_BY_PENALTY: <Clear color="light-1" />,
    UNKNOWN: <FormSubtract color="light-1" />,
  },
  statusIconsColored: {
    REGISTERED: <Add color="accent-1" />,
    AWAITING_CONTRIBUTION: <Currency color="accent-2" />,
    ACTIVE: <StatusGood color="status-ok" />,
    UNLOCK_REQUESTED: <Clock color="status-warning" />,
    DEREGISTERED_BY_UNLOCK: <Hide color="status-disabled" />,
    DECOMISSIONED: <Alert color="status-error" />,
    DEREGISTERED_BY_PENALTY: <Clear color="dark-2" />,
    UNKNOWN: <FormSubtract color="status-unknown" />,
  },
};

export default constants;
