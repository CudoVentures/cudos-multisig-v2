import { FetchedProposalDetailsData } from '.'
import { MembersUpdateTypes } from './MembersUpdateTypes'
import MultiSendType from './MultiSendType'
import { WalletSettingsUpdateType } from './WalletSettingsUpdateType'
import SingleSendType from './SingleSendType'

import {
    ADD_MEMBER_TYPE_URL,
    DELETE_MEMBER_TYPE_URL,
    GROUP_UPDATE_DECISION_POLICY_TYPE_URL,
    GROUP_UPDATE_METADATA_TYPE_URL,
    MULTI_SEND_TYPE_URL,
    SINGLE_SEND_TYPE_URL
} from 'utils/constants'

const TypeDetailsHandlerComponent = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {

    const component = (): JSX.Element => {

        switch (proposalDetails.msgType) {

            case GROUP_UPDATE_METADATA_TYPE_URL:
            case GROUP_UPDATE_DECISION_POLICY_TYPE_URL:
                return <WalletSettingsUpdateType proposalDetails={proposalDetails} />

            case SINGLE_SEND_TYPE_URL:
                return <SingleSendType proposalDetails={proposalDetails} />

            case MULTI_SEND_TYPE_URL:
                return <MultiSendType proposalDetails={proposalDetails} />

            case DELETE_MEMBER_TYPE_URL:
            case ADD_MEMBER_TYPE_URL:
                return <MembersUpdateTypes proposalDetails={proposalDetails} />

            default:
                return <></>
        }
    }

    return component()
}

export default TypeDetailsHandlerComponent
