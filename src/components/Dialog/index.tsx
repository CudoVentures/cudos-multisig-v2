import Failure from './Failure'
import Loading from './Loading'
import Success from './Success'
import VotingModal from './VotingModal'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import FundWallet from './FundWallet/FundWallet'
import AddressBook from './AddressBook/AddressBook'
import TransactionSelector from './TransactionSelector/TransactionSelector'
import ReusableModal from './ReusableModal'
import SingleSend from './SingleSend'
import MultiSend from './MultiSend'

const Dialog = () => {

  const {
    success,
    loading,
    failure,
    openAddressBook,
    openFundWallet,
    openSingleSendModal,
    openMultiSendModal,
    transactionSelector,
    openVotingModal,
    openReusableModal
  } = useSelector((state: RootState) => state.modalState)

  switch (true) {
    case failure:
      return <Failure />
    case loading:
      return <Loading />
    case success:
      return <Success />
    case openAddressBook:
      return <AddressBook />
    case openFundWallet:
      return <FundWallet />
    case openSingleSendModal:
      return <SingleSend />
    case openMultiSendModal:
      return <MultiSend />
    case transactionSelector:
      return <TransactionSelector />
    case openVotingModal:
      return <VotingModal />
    case openReusableModal:
      return <ReusableModal />
    default:
      return <div></div>
  }
}

export default Dialog
