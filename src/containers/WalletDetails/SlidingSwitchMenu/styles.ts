import { COLORS_DARK_THEME } from "theme/colors";

/* eslint-disable import/prefer-default-export */
export const styles = {
    addWalletBtn: {
        position: 'relative', 
        height: '35px', 
        marginRight: '20px'
    },
    switchAccount: {
        marginLeft: '10px', 
        position: 'relative', 
        float: 'left'
    },
    header: {
        width: '100%', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        display: 'flex'
    },
    contentHolder: {
        padding: '10px 10px 10px 50px', 
        height: '100%',
        width: '100%', 
        transition: 'all 0.2s', 
        opacity: '0'
    },
    menuHolder: {
        border: 'solid 2px red',
        padding: '0',
        height: '240px',
        width: '0px',
        opacity: '1',
        transition: "all 0.7s",
        left: '170px',
        borderRadius: '20px',
        position: 'relative',
        zIndex: '1',
        backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND,
    }
  } as const
  