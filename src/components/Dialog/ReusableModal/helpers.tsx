import { Box, Button, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { COLORS_DARK_THEME } from "theme/colors"
import DeleteMemberIcon from 'assets/vectors/delete-member-icon.svg'
import ExclamationMark from 'assets/vectors/yellow-exclamation-mark.svg'
import EditIcon from 'assets/vectors/blue-edit-icon.svg'
import { signingClient } from "utils/config"
import { DeliverTxResponse, EncodeObject, GasPrice, StdFee } from "cudosjs"
import { convertVotingPeriodToSeconds, enforceCustomFeesOverKeplr } from "utils/helpers"
import { HtmlTooltip } from "utils/multiSendTableHelper"
import { Fragment } from "react"
import { updateModalState } from "store/modals"
import { Member, votingPeriod } from "store/walletObject"
import { styles } from "./styles"

import {
    DEFAULT_MEMO,
    DEFAULT_META_DATA,
    DEFAULT_MULTIPLIER,
    DELETE_MEMBER_TYPE_URL,
    GAS_PRICE,
    GROUP_UPDATE_DECISION_POLICY_TYPE_URL,
    GROUP_UPDATE_METADATA_TYPE_URL,
    NATIVE_TOKEN_DENOM
} from "utils/constants"

export const executeMsgs = async (signer: string, msgs: EncodeObject[], fee: StdFee): Promise<DeliverTxResponse> => {

    enforceCustomFeesOverKeplr()

    return (await signingClient).signAndBroadcast(
        signer,
        msgs,
        fee,
        DEFAULT_MEMO
    )
}

export const getMembersUpdateMsgAndFees = async (
    members: Member[],
    walletId: number,
    walletAddress: string,
    signerAddress: string
): Promise<{
    msg: EncodeObject;
    fee: StdFee;
}> => {

    return (await signingClient).groupModule.msgUpdateMembersProposal(
        members,
        walletId,
        walletAddress,
        signerAddress,
        DEFAULT_META_DATA,
        GasPrice.fromString(GAS_PRICE + NATIVE_TOKEN_DENOM),
        DEFAULT_MULTIPLIER,
        DEFAULT_MEMO
    )
}

export const getWalletDecisionPolicyUpdateMsgAndFees = async (
    threshold: number,
    votingPeriod: number,
    walletAddress: string,
    signerAddress: string
): Promise<{
    msg: EncodeObject;
    fee: StdFee;
}> => {

    const compatibleTime: votingPeriod = convertVotingPeriodToSeconds(votingPeriod)
    return (await signingClient).groupModule.msgUpdateGroupDecisionPolicy(
        {
            threshold: threshold,
            votingPeriod: compatibleTime.seconds,
            minExecutionPeriod: 0
        },
        walletAddress,
        signerAddress,
        DEFAULT_META_DATA,
        GasPrice.fromString(GAS_PRICE + NATIVE_TOKEN_DENOM),
        DEFAULT_MULTIPLIER,
        DEFAULT_MEMO
    )
}

export const getWalletMetadataUpdateMsgAndFees = async (
    metadata: string,
    walletId: number,
    walletAddress: string,
    signerAddress: string
): Promise<{
    msg: EncodeObject;
    fee: StdFee;
}> => {

    return (await signingClient).groupModule.msgUpdateGroupMetadata(
        metadata,
        walletId,
        walletAddress,
        signerAddress,
        DEFAULT_META_DATA,
        GasPrice.fromString(GAS_PRICE + NATIVE_TOKEN_DENOM),
        DEFAULT_MULTIPLIER,
        DEFAULT_MEMO
    )
}

export const TitleAndSubtitle = (): JSX.Element => {

    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const msgType: string = dataObject!.msgType as string

    let title: string = 'Add New Member'
    let subTitle: string | JSX.Element = 'In order to add new member fill in the information below'

    if (msgType === GROUP_UPDATE_METADATA_TYPE_URL) {
        title = 'Edit Wallet Details'
        subTitle = 'Update name and general info'
    }

    if (msgType === GROUP_UPDATE_DECISION_POLICY_TYPE_URL) {
        title = 'Edit Wallet Policies'
        subTitle = 'Update approvals and voting period'
    }

    if (msgType === DELETE_MEMBER_TYPE_URL) {
        const memberName: string = dataObject!.memberName as string

        title = 'Do you want to delete?'
        subTitle = (
            <span>
                {"Are you sure you want to delete"}
                <span style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE, margin: '0 5px' }}>
                    {memberName}
                </span>
                {"from the wallet? You cannot undo this action."}
            </span>
        )
    }

    return (
        <Box style={styles.titleHolder}>
            {msgType === DELETE_MEMBER_TYPE_URL ?
                <img
                    style={{ marginBottom: '10px' }}
                    src={DeleteMemberIcon}
                    alt="attention-icon"
                /> : null}

            <Typography
                textAlign={'center'}
                id='Title'
                fontWeight={700}
                variant='h5'
                color='text.primrary'
            >
                {title}
            </Typography>

            <Typography
                marginTop={1}
                textAlign={'center'}
                id='SubTitle'
                fontWeight={400}
                variant='subtitle1'
                color='text.secondary'
            >
                {subTitle}
            </Typography>
        </Box>
    )
}

export const EditBtn = ({ msgType }: { msgType: string }): JSX.Element => {

    const dispatch = useDispatch()

    const handleReusableModal = (msgType: string) => {
        dispatch(updateModalState({
            openReusableModal: true,
            dataObject: {
                msgType: msgType
            }
        }))
    }

    return (
        <Button
            disableRipple
            style={styles.addressBookBtn}
            onClick={() => handleReusableModal(msgType)}
        >
            <img style={styles.addressBookIcon} src={EditIcon} alt="Edit Logo Icon" />
            Edit
        </Button>
    )
}

export const ApprovalsTitleWithTooltip = (): JSX.Element => {
    return (
        <Box style={{ margin: '10px 0px' }}>
            <span>Approvals</span>
            <HtmlTooltip
                placement="top"
                title={
                    <Fragment>
                        <Typography>Approvals</Typography>
                        <div>
                            <span>This will be the minimum count of approvals gathered from the wallet members in order for a transaction to be executed.</span>
                        </div>
                        <small style={{ color: 'orange' }}>{'*At least 1 approval is required to be selected.'}</small>
                    </Fragment>}
            >
                <img style={{ marginLeft: '5px' }} src={ExclamationMark} alt="Exclamation-mark-icon" />
            </HtmlTooltip>
        </Box>
    )
}

export const VotingPeriodTitleWithTooltip = (): JSX.Element => {
    return (
        <Box style={{ margin: '10px 0px' }}>
            <span>Voting Period</span>
            <HtmlTooltip
                placement="top"
                title={
                    <Fragment>
                        <Typography>Voting Period</Typography>
                        <div>
                            <span>After a transaction is proposed to the wallet members to be executed, this will be the maximum period of time for the members to express their approval or dissaproval.</span>
                        </div>
                        <small style={{ color: 'orange' }}>{'*A transaction can be executed without waiting for this period to end if the minimum number of approvals is reached'}</small>
                    </Fragment>}
            >
                <img style={{ marginLeft: '5px' }} src={ExclamationMark} alt="Exclamation-mark-icon" />
            </HtmlTooltip>
        </Box>
    )
}