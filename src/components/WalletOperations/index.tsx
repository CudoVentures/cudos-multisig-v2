
import { Box, Typography  } from '@mui/material'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'

export const MenuSelectionInfo = () => {

  const { menuSelection } = useSelector((state: RootState) => state.menu)
  
  let title: string = 'Dashboard'
  let subTitle: string = "Here is your MultiSig Wallet information and a list with your assets"

  switch (menuSelection){
    case 0:
      title = 'Dashboard'
      subTitle = 'Here is your MultiSig Wallet information and a list with your assets'
      break
    case 1:
      title = 'Transactions'
      subTitle = 'Here are displayed the transactions associated with the selected wallet'
      break
    case 2:
    title = 'Members'
    subTitle = '....................................'
    break
    case 3:
      title = 'Settings'
      subTitle = 'Customise wallet details'
      break
    default:
      break
  }

  return (
    <div>
      <Box>
        <h3 style={{float: 'left', margin: '3px auto'}}>{title}</h3>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          <span style={{float: 'left'}}>{subTitle}</span>
        </Typography>
      </Box>
    </div>
  )
}
