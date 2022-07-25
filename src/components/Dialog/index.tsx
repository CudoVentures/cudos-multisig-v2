import Failure from './Failure'
import Loading from './Loading'
import Success from './Success'
import VotingModal from './VotingModal'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import FundWallet from './FundWallet/FundWallet'
import AddressBook from './AddressBook/AddressBook'
import TransactionSelector from './TransactionSelector/TransactionSelector'

const Dialog = () => {

  const {
    success,
    loading,
    failure,
    openAddressBook,
    openFundWallet,
    transactionSelector,
    openVotingModal
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
    case transactionSelector:
      return <TransactionSelector />
    case openVotingModal:
      return <VotingModal />
    default:
      return <div></div>
  }
}

export default Dialog
