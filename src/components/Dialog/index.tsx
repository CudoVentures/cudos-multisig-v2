import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import AddressBook from './AddressBook/AddressBook'
import Failure from './Failure'
import Loading from './Loading'
import Success from './Success'

const Dialog = () => {

  const { 
    success,
    loading, 
    failure,
    openAddressBook
  } = useSelector((state: RootState) => state.modalState)

  switch(true) {
    case failure:
      return <Failure />
    case loading:
      return <Loading />
    case success:
      return <Success />
    case openAddressBook:
      return <AddressBook />
    default:
      return <div></div>
  }
}

export default Dialog
