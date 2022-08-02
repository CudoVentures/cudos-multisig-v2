import { ADD_MEMBER_TYPE_URL, DELETE_MEMBER_TYPE_URL, MULTI_SEND_TYPE_URL } from 'utils/constants'
import { FetchedProposalDetailsData } from '.'
import { MembersUpdateTypes } from './MembersUpdateTypes'
import MultiSendType from './MultiSendType'

const TypeDetailsHandlerComponent = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {

    const component = (): JSX.Element => {

        switch (proposalDetails.msgType) {
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
