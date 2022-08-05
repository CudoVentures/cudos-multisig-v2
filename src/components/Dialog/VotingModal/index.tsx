import { RootState } from 'store'
import { styles } from './styles'
import { styles as defaultStyles } from '../styles'
import { updateModalState } from 'store/modals'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CancelRoundedIcon, ModalContainer } from '../styles'
import CommentIcon from 'assets/vectors/comment-icon.svg'
import { signingClient } from 'utils/config'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import { Exec } from 'cudosjs/build/stargate/modules/group/proto-types/tx.pb'
import { calculateFeeFromGas, enforceCustomFeesOverKeplr } from 'utils/helpers'
import { assertIsDeliverTxSuccess, EncodeObject, GasPrice, StdFee } from 'cudosjs'
import { VoteOption } from 'cudosjs/build/stargate/modules/group/proto-types/types.pb'
import { Box, Button, Typography, Collapse, Dialog as MuiDialog, Paper } from '@mui/material'

import {
    DEFAULT_LOADING_MODAL_MSG,
    DEFAULT_MEMO,
    DEFAULT_MULTIPLIER,
    GAS_PRICE,
    GENERAL_FAILURE_MSG,
    GENERAL_FAILURE_TITLE,
    NATIVE_TOKEN_DENOM,
    PROPOSAL_EXECUTING_SUCCESS_MSG,
    PROPOSAL_OPTION_EXECUTE,
    PROPOSAL_VOTING_ERROR_TYPE,
    PROPOSAL_VOTING_SUCCESS_MSG,
    PROPOSAL_VOTING_SUCCESS_TYPE,
    VOTE_OPTION_NO,
    VOTE_OPTION_YES,
} from 'utils/constants'

const VotingModal = () => {

    const dispatch = useDispatch()
    const { openVotingModal, dataObject } = useSelector((state: RootState) => state.modalState)
    const { address } = useSelector((state: RootState) => state.userState)
    const [textArea, setTextArea] = useState<string>('')
    const [collapsed, setCollapsed] = useState<boolean>(false)
    const proposalID: number = parseInt(dataObject!.proposalID as string)
    const chosenOption: string = dataObject!.option as string

    const option: string =
        chosenOption === VOTE_OPTION_YES ? 'Approve' :
            chosenOption === PROPOSAL_OPTION_EXECUTE ? 'Execute' :
                'Reject'

    const getMsgAndFees = async (): Promise<{ msg: EncodeObject; fee: StdFee; }> => {

        if (chosenOption === PROPOSAL_OPTION_EXECUTE) {
            return getExecutionMsgAndFees()
        }

        return getVotingMsgAndFees(VoteOption[chosenOption as keyof typeof VoteOption])
    }

    const getExecutionMsgAndFees = async () => {
        return (await signingClient).groupModule.msgExec(
            proposalID,
            address!,
            GasPrice.fromString(GAS_PRICE + NATIVE_TOKEN_DENOM),
            DEFAULT_MULTIPLIER,
            DEFAULT_MEMO
        )
    }

    const getVotingMsgAndFees = async (voteOption: number) => {
        return (await signingClient).groupModule.msgVote(
            proposalID,
            address!,
            voteOption,
            textArea,
            Exec.EXEC_UNSPECIFIED,
            GasPrice.fromString(GAS_PRICE + NATIVE_TOKEN_DENOM),
            DEFAULT_MULTIPLIER,
            DEFAULT_MEMO
        )
    }

    const handleChange = (e: any) => {
        setTextArea(e.target.value)
    }

    const closeVotingModal = () => {
        dispatch(updateModalState({
            openVotingModal: false,
        }))
    }

    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
            closeVotingModal()
        }
    }

    const handleCollapse = () => {
        setCollapsed(!collapsed)
        if (collapsed) {
            setTextArea('')
        }
    }

    const vote = async () => {
        try {
            const { msg, fee } = await getMsgAndFees()

            dispatch(updateModalState({
                openVotingModal: false,
                loading: true,
                message: DEFAULT_LOADING_MODAL_MSG
            }))

            enforceCustomFeesOverKeplr()

            try {
                const result = await (await signingClient).signAndBroadcast(
                    address!,
                    [msg],
                    fee,
                    DEFAULT_MEMO
                )
                assertIsDeliverTxSuccess(result)

                const tempFee = calculateFeeFromGas(result.gasUsed)
                const displayWorthyFee = handleFullBalanceToPrecision(tempFee, 4, 'CUDOS')

                const dataObjectForSuccessModal = {
                    votingOption: chosenOption,
                    proposalID: proposalID,
                    txHash: result.transactionHash,
                    txFee: displayWorthyFee,
                }

                dispatch(updateModalState({
                    loading: false,
                    success: true,
                    msgType: PROPOSAL_VOTING_SUCCESS_TYPE,
                    dataObject: dataObjectForSuccessModal,
                    message:
                        chosenOption === PROPOSAL_OPTION_EXECUTE ? PROPOSAL_EXECUTING_SUCCESS_MSG :
                            PROPOSAL_VOTING_SUCCESS_MSG
                }))

            } catch (e: any) {
                dispatch(updateModalState({
                    loading: false,
                    failure: true,
                    title: GENERAL_FAILURE_TITLE,
                    msgType: PROPOSAL_VOTING_ERROR_TYPE,
                    message: GENERAL_FAILURE_MSG
                }))
                console.debug(e.message)
            }

        } catch (error: any) {
            dispatch(updateModalState({
                failure: true,
                title: GENERAL_FAILURE_TITLE,
                msgType: PROPOSAL_VOTING_ERROR_TYPE,
                message: GENERAL_FAILURE_MSG
            }))
            console.debug(error.message)
        }
    }

    return (
        <MuiDialog
            BackdropProps={defaultStyles.defaultBackDrop}
            open={openVotingModal!}
            onClose={closeModal}
            PaperProps={
                chosenOption === PROPOSAL_OPTION_EXECUTE ? styles.executePaperProps :
                    styles.paperProps
            }
        >
            <ModalContainer sx={styles.modalContainer}>
                <CancelRoundedIcon onClick={closeVotingModal} />
                <Box style={{ width: '100%', margin: '20px' }}>
                    <Box style={styles.uperInfoHolder}>
                        <Typography
                            fontWeight={700}
                            variant={'h5'}
                        >
                            {`Do you want to ${option}?`}
                        </Typography>
                        <Typography
                            fontWeight={700}
                            variant={'subtitle1'}
                            color={'text.secondary'}
                        >
                            Once submitted this action cannot be reversed
                        </Typography>
                        {
                            chosenOption === PROPOSAL_OPTION_EXECUTE ? null :
                                <Box style={{ display: 'flex', margin: '20px' }}>
                                    <img src={CommentIcon} alt="Comment Icon" />
                                    <Button
                                        disableRipple
                                        onClick={handleCollapse}
                                        variant="text"
                                        style={styles.addComment}
                                    >
                                        {collapsed ? "Remove comment" : "Leave comment"}
                                    </Button>
                                </Box>
                        }
                    </Box>
                    <Box style={styles.textAreaHolder}>
                        <Collapse in={collapsed} timeout="auto" unmountOnExit>
                            <Paper
                                style={{ width: '350px', height: '100px' }}
                                elevation={1}
                            >
                                <textarea
                                    value={textArea}
                                    placeholder="Optional comment"
                                    style={styles.textArea}
                                    onChange={handleChange}
                                />
                            </Paper>
                        </Collapse>
                    </Box>
                    <Box style={styles.btnHolderBox}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={styles.confirmationBtns}
                            onClick={closeVotingModal}
                        >
                            No, Go Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={styles.confirmationBtns}
                            onClick={vote}
                        >
                            {`Yes, ${option}`}
                        </Button>
                    </Box>
                </Box>
            </ModalContainer>
        </MuiDialog>
    )
}

export default VotingModal
