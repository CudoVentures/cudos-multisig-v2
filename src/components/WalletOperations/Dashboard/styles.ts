import { COLORS_DARK_THEME } from "theme/colors";

/* eslint-disable import/prefer-default-export */
export const styles = {
    dashboardBoxHolder: {
        display: 'flex', 
        width: '100%', 
        height: '240px'
    },
    upperLeftCardHolder: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        width: '50%', 
        margin: '10px 10px 10px 0px'
    },
    formattedAddressHolder: {
        padding: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        borderRadius: '10px', 
        width: '100%',
        justifyContent: 'space-evenly',
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND
    },
    upperCardBoxHolder: {
        marginTop: '15px', 
        padding: '10px 15px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderRadius: '10px', 
        width: '100%', 
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND
    },
    upperCardChildBoxHolder: {
        display: 'flex', 
        alignItems: 'flex-start', 
        flexDirection: 'column'
    },
    upperRightCardHolder: {
        width: '50%', 
        margin: '10px 0px 10px 10px'
    },
    upperRightBoxHolder: {
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'start'
    },
    upperRightInfoHolder: {
        display:'flex',
        justifyContent: 'space-between', 
        alignItems:'center', 
        width: '100%', 
        paddingBottom: '5px'
    },
    balanceAssetsBtnHolder: {
        float: 'right', 
        display: 'flex', 
        alignItems: 'center'
    },
    lowerCardHolder: {
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        height: '100%', 
        marginTop: '10px',
        paddingBottom: '10px'
    },
    lowerBoxHolder: {
        display: 'flex', 
        width: '100%', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        flexDirection: 'row'
    }

} as const
    