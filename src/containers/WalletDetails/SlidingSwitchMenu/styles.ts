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
        display: 'flex',
        margin: '5px 0px 10px 0px',
    },
    contentHolder: {
        padding: '10px 10px 10px 50px', 
        height: '100%',
        width: '100%', 
        transition: 'all 0.5s', 
        opacity: '0'
    },
    menuHolder: {
        padding: '0',
        height: '250px',
        width: '0px',
        opacity: '1',
        transition: "all 0.7s",
        left: '170px',
        borderRadius: '20px',
        position: 'relative',
        zIndex: '1',
        backgroundColor: '#7d87aa21',
    }
  } as const
  