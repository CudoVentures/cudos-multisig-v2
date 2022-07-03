import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import { styles } from './styles'
import { useDispatch } from 'react-redux'
import { COLORS_DARK_THEME } from 'theme/colors'

import ActiveDashboardIcon from 'assets/vectors/dashboard/active-dashboard.svg'
import InactiveDashboardIcon from 'assets/vectors/dashboard/inactive-dashboard.svg'
import ActiveTransactionsIcon from 'assets/vectors/dashboard/active-transactions.svg'
import InactiveTransactionsIcon from 'assets/vectors/dashboard/inactive-transactions.svg'
import ActiveMembersIcon from 'assets/vectors/dashboard/active-members.svg'
import InactiveMembersIcon from 'assets/vectors/dashboard/inactive-members.svg'
import ActiveSettingsIcon from 'assets/vectors/dashboard/active-settings.svg'
import InactiveSettingsIcon from 'assets/vectors/dashboard/inactive-settings.svg'
import { updateMenuSelectionState } from 'store/menu'

const LeftMenu = () => {

  const dispatch = useDispatch()
  const [selected, setSelected] = useState<number>(0)

  const MenuItems = [
    { active: ActiveDashboardIcon, inactive: InactiveDashboardIcon, text: 'Dashboard' },
    { active: ActiveTransactionsIcon, inactive: InactiveTransactionsIcon, text: 'Transactions' },
    { active: ActiveMembersIcon, inactive: InactiveMembersIcon, text: 'Members' },
    { active: ActiveSettingsIcon, inactive: InactiveSettingsIcon, text: 'Settings' }
  ]

  useEffect(() => {
    dispatch(updateMenuSelectionState({menuSelection: selected}))
  }, [selected])

  return (
      <Box gap={1} style={styles.menuHolder}>
        {MenuItems.map((item, index) => (
          <Button
          disableRipple
          variant="text"
          sx={{...styles.menuBtn, color: selected === index?"white":COLORS_DARK_THEME.SECONDARY_TEXT}}
          onClick={() => setSelected(index)}
        >
          <img 
            style={styles.menuIcon} 
            src={selected === index?item.active:item.inactive} 
            alt={`${item.text}-icon`} 
          />
          <span>{item.text}</span>
        </Button>
        ))}
      </Box>
  )
}

export default LeftMenu
