import { RootState } from 'store'
import { styles } from './styles'
import { styles as defaultStyles } from '../styles'
import { updateModalState } from 'store/modals'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog as MuiDialog } from '@mui/material'
import { executeMsgs, TitleAndSubtitle } from './helpers'
import DeleteMemberContent from './DeleteMemberContent'
import AddNewMemberContent from './AddNewMemberContent'
import { CancelRoundedIcon, ModalContainer } from '../styles'
import { initialState as initialModalState } from 'store/modals'
import { useCallback } from 'react'
import { calculateFeeFromGas } from 'utils/helpers'
import UpdateWalletSettings from './UpdateWalletSettings'
import { assertIsDeliverTxSuccess, EncodeObject, StdFee } from 'cudosjs'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import UpdateWalletPolicies from './UpdateWalletPolicies'

import {
    DEFAULT_LOADING_MODAL_MSG,
    DELETE_MEMBER_TYPE_URL,
    GENERAL_FAILURE_MSG,
    GENERAL_FAILURE_TITLE,
    GROUP_UPDATE_DECISION_POLICY_TYPE_URL,
    GROUP_UPDATE_METADATA_TYPE_URL,
    PROPOSAL_CREATION_SUCCESS_MSG,
} from 'utils/constants'

const ReusableModal = () => {

    const dispatch = useDispatch()
    const { address, connectedLedger } = useSelector((state: RootState) => state.userState)
    const { openReusableModal, dataObject } = useSelector((state: RootState) => state.modalState)
    const msgType: string = dataObject!.msgType as string

    const closeReusableModal = () => {
        localStorage.clear
        dispatch(updateModalState({ ...initialModalState }))
    }

    const closeModal = (ev?: any, reason?: string) => {
        if (reason !== 'backdropClick') {
            closeReusableModal()
        }
    }

    const ContentHandler = useCallback((): JSX.Element => {

        switch (msgType) {
            case GROUP_UPDATE_METADATA_TYPE_URL:
                return <UpdateWalletSettings propose={propose} close={closeModal} />

            case GROUP_UPDATE_DECISION_POLICY_TYPE_URL:
                return <UpdateWalletPolicies propose={propose} close={closeModal} />

            case DELETE_MEMBER_TYPE_URL:
                return <DeleteMemberContent propose={propose} close={closeModal} />

            default:
                return <AddNewMemberContent propose={propose} close={closeModal} />
        }

    }, [msgType])

    const propose = async (
        msgs: EncodeObject[],
        fees: StdFee,
        msgSpecificData: any
    ) => {
        try {
            dispatch(updateModalState({
                openReusableModal: false,
                loading: true,
                message: DEFAULT_LOADING_MODAL_MSG
            }))

            const result = await executeMsgs(address!, msgs, fees, connectedLedger!)

            assertIsDeliverTxSuccess(result)

            const tempFee = calculateFeeFromGas(result.gasUsed)
            const displayWorthyFee = handleFullBalanceToPrecision(tempFee, 4, 'CUDOS')

            const dataObjectForSuccessModal = {
                msgSpecificData: msgSpecificData,
                txHash: result.transactionHash,
                txFee: displayWorthyFee,
            }

            dispatch(updateModalState({
                loading: false,
                success: true,
                msgType: msgType,
                dataObject: dataObjectForSuccessModal,
                message: PROPOSAL_CREATION_SUCCESS_MSG
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
            BackdropProps={defaultStyles.defaultBackDrop}
            open={openReusableModal!}
            onClose={closeModal}
            PaperProps={defaultStyles.defaultPaperProps}
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

export default ReusableModal
