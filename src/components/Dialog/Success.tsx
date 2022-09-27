import { RootState } from 'store'
import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import SuccessIcon from 'assets/vectors/success.svg'
import WalletCreationSuccess from './WalletCreationSuccess'
import { useNavigate } from 'react-router-dom'
import BankSendTypeSuccess from './BankSendTypeSuccess'
import ProposalCreationSuccess from './ProposalCreationSuccess'
import VotingOnProposalSuccess from './VotingOnProposalSuccess'
import MembersUpdateSuccess from './MembersUpdateSuccess'
import { CancelRoundedIcon, ModalContainer, styles } from './styles'
import { initialState as initialModalState, updateModalState } from 'store/modals'
import WalletUpdateSuccess from './WalletUpdateSuccess'
import { updateMenuSelectionState } from 'store/menu'

import {
  ADD_MEMBER_TYPE_URL,
  DELETE_MEMBER_TYPE_URL,
  GROUP_UPDATE_DECISION_POLICY_TYPE_URL,
  GROUP_UPDATE_METADATA_TYPE_URL,
  MULTI_SEND_TYPE_URL,
  PROPOSAL_CREATION_SUCCESS_TYPE,
  PROPOSAL_VOTING_SUCCESS_TYPE,
  SINGLE_SEND_TYPE_URL,
  WALLET_CREATION_SUCCESS_TYPE,
  WALLET_FUNDING_SUCCESS_TYPE
} from 'utils/constants'

const Success = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    success,
    message,
    msgType,
  } = useSelector((state: RootState) => state.modalState)

  let contentComponent: JSX.Element = (<div></div>)
  let navPath: string = '/dashboard'

  switch (msgType) {

    case GROUP_UPDATE_DECISION_POLICY_TYPE_URL:
    case GROUP_UPDATE_METADATA_TYPE_URL:
      contentComponent = <WalletUpdateSuccess />
      break

    case DELETE_MEMBER_TYPE_URL:
    case ADD_MEMBER_TYPE_URL:
      contentComponent = <MembersUpdateSuccess />
      break

    case PROPOSAL_VOTING_SUCCESS_TYPE:
      contentComponent = <VotingOnProposalSuccess />
      break

    case PROPOSAL_CREATION_SUCCESS_TYPE:
      contentComponent = <ProposalCreationSuccess />
      break

    case WALLET_CREATION_SUCCESS_TYPE:
      contentComponent = <WalletCreationSuccess />
      navPath = '/welcome'
      break

    case MULTI_SEND_TYPE_URL:
    case SINGLE_SEND_TYPE_URL:
    case WALLET_FUNDING_SUCCESS_TYPE:
      contentComponent = <BankSendTypeSuccess />
      break

    default:
      break
  }

  const handleModalClose = () => {
    dispatch(updateModalState({ ...initialModalState }))
    dispatch(updateMenuSelectionState({ menuSelection: 0 }))
    navigate(navPath)
  }

  const closeModal = (event: {}, reason: string) => {
    if (reason !== 'backdropClick') {
      handleModalClose()
    }
  }

  return (
    <MuiDialog
      BackdropProps={styles.defaultBackDrop}
      open={success!}
      onClose={closeModal}
      PaperProps={styles.defaultPaperProps}
    >
      <ModalContainer sx={{ padding: '4rem' }}>
        <img src={SuccessIcon} alt="success-icon" />
        <CancelRoundedIcon onClick={handleModalClose} />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
        >
          <Typography
            variant="h4"
            fontWeight={900}
            letterSpacing={2}
          >
            Success!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {message}
          </Typography>
        </Box>
        {contentComponent}
        <Button
          variant="contained"
          color="primary"
          sx={() => ({
            width: '50%',
            fontWeight: 700
          })}
          onClick={handleModalClose}
        >
          Close
        </Button>
      </ModalContainer>
    </MuiDialog>
  )
}

export default Success
