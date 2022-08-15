import { MutableRefObject, useEffect, useRef } from 'react'
import { Box, Button } from '@mui/material'
import { styles } from './styles'
import { useDispatch, useSelector } from 'react-redux'
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
import { RootState } from 'store'
import { useNavigate } from 'react-router-dom'

const LeftMenu = ({
  rightStepsContent,
  selected,
  setSelected
}: {
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  rightStepsContent: MutableRefObject<HTMLInputElement>;
}) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const defaultElement = document.createElement('div') as HTMLInputElement
  const menuHolder = useRef<HTMLInputElement>(defaultElement)
  const { menuSelection } = useSelector((state: RootState) => state.menu)

  const MenuItems = [
    { active: ActiveDashboardIcon, inactive: InactiveDashboardIcon, text: 'Dashboard' },
    { active: ActiveTransactionsIcon, inactive: InactiveTransactionsIcon, text: 'Transactions' },
    { active: ActiveMembersIcon, inactive: InactiveMembersIcon, text: 'Members' },
    { active: ActiveSettingsIcon, inactive: InactiveSettingsIcon, text: 'Settings' }
  ]

  useEffect(() => {
    rightStepsContent.current.style.opacity = '0'
    setTimeout(() => dispatch(updateMenuSelectionState({ menuSelection: selected })), 400)
    setTimeout(() => rightStepsContent.current.style.opacity = '1', 400)
    setTimeout(() => navigate(`/${MenuItems[selected].text.toLowerCase()}`), 400)
  }, [selected])

  return (
    <Box ref={menuHolder} gap={1} style={styles.menuHolder}>
      {MenuItems.map((item, index) => (
        <Button
          disableRipple
          variant="text"
          sx={{ ...styles.menuBtn, color: menuSelection === index ? "white" : COLORS_DARK_THEME.SECONDARY_TEXT }}
          onClick={() => setSelected(index)}
        >
          <img
            style={styles.menuIcon}
            src={menuSelection === index ? item.active : item.inactive}
            alt={`${item.text}-icon`}
          />
          <span>{item.text}</span>
        </Button>
      ))}
    </Box>
  )
}

export default LeftMenu
