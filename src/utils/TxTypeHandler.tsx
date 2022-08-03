import { Box, Typography } from '@mui/material'

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
} from './constants'

const chainTxType = {
    [MULTI_SEND_TYPE_URL]: MULTI_SEND_TYPE,
    [ADD_MEMBER_TYPE_URL]: ADD_MEMBER_TYPE,
    [DELETE_MEMBER_TYPE_URL]: DELETE_MEMBER_TYPE,
    [GROUP_UPDATE_METADATA_TYPE_URL]: UPDATE_WALLET_SETTINGS_TYPE,
    [GROUP_UPDATE_DECISION_POLICY_TYPE_URL]: UPDATE_WALLET_POLICIES_TYPE,
    [UNDEFINED]: UNDEFINED_TYPE
}

export const determineType = (proposal: any): string => {
    const proposalMessage = proposal?.messages[0] ? proposal?.messages[0] : null
    const msgType: string = proposalMessage["@type"]

    if (msgType === MEMBERS_UPDATE_TYPE_URL) {
        const proposalMessage = proposal?.messages[0] ? proposal?.messages[0] : null
        const updatedMembers = proposalMessage.member_updates
        const zeroWeight = updatedMembers.find((m: { weight: string }) => m.weight === '0')

        if (zeroWeight) {
            return DELETE_MEMBER_TYPE_URL
        }
        return ADD_MEMBER_TYPE_URL
    }

    return msgType
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
