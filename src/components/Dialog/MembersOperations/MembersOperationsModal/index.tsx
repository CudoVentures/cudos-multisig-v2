import { RootState } from 'store'
import { styles } from '../styles'
import { updateModalState } from 'store/modals'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog as MuiDialog } from '@mui/material'
import { getMsgAndFees, TitleAndSubtitle } from '../helpers'
import DeleteMemberContent from '../DeleteMemberContent'
import AddNewMemberContent from '../AddNewMemberContent'
import { CancelRoundedIcon, ModalContainer } from '../../styles'
import { initialState as initialModalState } from 'store/modals'
import { useCallback } from 'react'
import { Member } from 'store/walletObject'
import { calculateFeeFromGas, enforceCustomFeesOverKeplr } from 'utils/helpers'
import { getSigningClient } from 'utils/config'
import { assertIsDeliverTxSuccess } from 'cudosjs'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'

import {
    DEFAULT_LOADING_MODAL_MSG,
    DEFAULT_MEMO,
    DELETE_MEMBER_TYPE_URL,
    GENERAL_FAILURE_MSG,
    GENERAL_FAILURE_TITLE,
    UPDATING_MEMBERS_SUCCESS_MSG
} from 'utils/constants'

const MembersOperationsModal = () => {

    const dispatch = useDispatch()
    const { address, selectedWallet } = useSelector((state: RootState) => state.userState)
    const { openMembersOperationsModal, dataObject } = useSelector((state: RootState) => state.modalState)
    const walletId: number = parseInt(selectedWallet!.walletID!)
    const msgType: string = dataObject!.msgType as string

    const closeMembersOperationsModal = () => {
        localStorage.clear
        dispatch(updateModalState({ ...initialModalState }))
    }

    const closeModal = (ev?: any, reason?: string) => {
        if (reason !== 'backdropClick') {
            closeMembersOperationsModal()
        }
    }

    const ContentHandler = useCallback((): JSX.Element => {
        if (msgType === DELETE_MEMBER_TYPE_URL) {
            return (
                <DeleteMemberContent
                    propose={propose}
                    close={closeModal}
                />
            )
        }

        return (
            <AddNewMemberContent
                propose={propose}
                close={closeModal}
            />
        )
    }, [msgType])


    const propose = async (
        members: Member[],
        memberName: string,
        memberAddress: string
    ) => {

        try {
            const { msg, fee } = await getMsgAndFees(
                members,
                walletId,
                selectedWallet?.walletAddress!,
                address!
            )

            dispatch(updateModalState({
                openMembersOperationsModal: false,
                loading: true,
                message: DEFAULT_LOADING_MODAL_MSG
            }))

            enforceCustomFeesOverKeplr()

            const client = await getSigningClient();
            const result = await client.signAndBroadcast(
                address!,
                [msg],
                fee,
                DEFAULT_MEMO
            )
            assertIsDeliverTxSuccess(result)

            const tempFee = calculateFeeFromGas(result.gasUsed)
            const displayWorthyFee = handleFullBalanceToPrecision(tempFee, 4, 'CUDOS')

            const dataObjectForSuccessModal = {
                member: {
                    metadata: memberName,
                    address: memberAddress
                },
                txHash: result.transactionHash,
                txFee: displayWorthyFee,
            }

            dispatch(updateModalState({
                loading: false,
                success: true,
                msgType: msgType,
                dataObject: dataObjectForSuccessModal,
                message: UPDATING_MEMBERS_SUCCESS_MSG
            }))

        } catch (e: any) {
            dispatch(updateModalState({
                loading: false,
                failure: true,
                title: GENERAL_FAILURE_TITLE,
                msgType: msgType,
                message: GENERAL_FAILURE_MSG
            }))
            console.debug(e.message)
        }
    }

    return (
        //CONTENT WRAPPER
        <MuiDialog
            BackdropProps={styles.backDrop}
            open={openMembersOperationsModal!}
            onClose={closeModal}
            PaperProps={styles.paperProps}
        >
            <ModalContainer sx={styles.modalContainer}>
                <CancelRoundedIcon onClick={closeModal} />

                {/* TITLE & SUBTITLE */}
                <TitleAndSubtitle />

                {/* MAIN CONTENT */}
                <ContentHandler />

            </ModalContainer>
        </MuiDialog>
    )
}

export default MembersOperationsModal
