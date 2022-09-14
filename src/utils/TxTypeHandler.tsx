import { Box, Typography } from '@mui/material'
import { ProposalMsg, MsgSend, MsgUpdateMember } from 'components/Dialog/ProposalDetails'

import {
    UNDEFINED,
    MULTI_SEND_TYPE_URL,
    MULTI_SEND_TYPE,
    UNDEFINED_TYPE,
    ADD_MEMBER_TYPE_URL,
    DELETE_MEMBER_TYPE_URL,
    ADD_MEMBER_TYPE,
    DELETE_MEMBER_TYPE,
    MEMBERS_UPDATE_TYPE_URL,
    GROUP_UPDATE_DECISION_POLICY_TYPE_URL,
    GROUP_UPDATE_METADATA_TYPE_URL,
    UPDATE_WALLET_SETTINGS_TYPE,
    UPDATE_WALLET_POLICIES_TYPE,
    SINGLE_SEND_TYPE_URL,
    SINGLE_SEND_TYPE,
} from './constants'

const chainTxType = {
    [MULTI_SEND_TYPE_URL]: MULTI_SEND_TYPE,
    [SINGLE_SEND_TYPE_URL]: SINGLE_SEND_TYPE,
    [ADD_MEMBER_TYPE_URL]: ADD_MEMBER_TYPE,
    [DELETE_MEMBER_TYPE_URL]: DELETE_MEMBER_TYPE,
    [GROUP_UPDATE_METADATA_TYPE_URL]: UPDATE_WALLET_SETTINGS_TYPE,
    [GROUP_UPDATE_DECISION_POLICY_TYPE_URL]: UPDATE_WALLET_POLICIES_TYPE,
    [UNDEFINED]: UNDEFINED_TYPE
}

export const determineType = (msgs: ProposalMsg[] | undefined): string => {
    const msg = msgs![0]!
    if ('from_address' in msg) {
        return SINGLE_SEND_TYPE_URL
    }
    if ('inputs' in msg) {
        return MULTI_SEND_TYPE_URL
    }
    if ('decision_policy' in msg) {
        return GROUP_UPDATE_DECISION_POLICY_TYPE_URL
    }
    if ('metadata' in msg) {
        return GROUP_UPDATE_METADATA_TYPE_URL
    }
    
    const updatedMembers = (msg as MsgUpdateMember).member_updates
    if (updatedMembers.some(m => m.weight === 0)) {
        return DELETE_MEMBER_TYPE_URL
    }

    return ADD_MEMBER_TYPE_URL
}

export const TxTypeComponent = ({ type }: { type: string }): JSX.Element => {
    let chainType: string = type
    if (!chainTxType[chainType as keyof typeof chainTxType]) { chainType = UNDEFINED }

    const icon: string = chainTxType[chainType as keyof typeof chainTxType].icon
    const text: string = chainTxType[chainType as keyof typeof chainTxType].text

    return (
        <Box style={{ display: 'flex', alignItems: 'center' }}>
            <img style={{ marginRight: '5px' }} src={icon} alt={`${chainType} logo`} />
            <Typography style={{ float: 'left' }} variant="subtitle2" fontWeight={600} >
                {text}
            </Typography>
        </Box>
    )
}
