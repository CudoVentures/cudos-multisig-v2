import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    walletAddress: {
        display: 'flex', 
        margin: '30px 0 5px 0', 
        justifyContent: 'space-between'
    },
    connectedAddress: {
        width: '100%', 
        display: 'flex', 
        margin: '50px 0 5px 0', 
        justifyContent: 'space-between'
    },
    multiSigTitle: {
        marginBottom: '3px', 
        marginRight: '10px', 
        float: 'left'
    },
    TxSummaryHolder: {
        transition: 'all 0.5s', 
        paddingTop: '70px', 
        opacity: '0', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
    },
    TxSummaryAddressesHolder: {
        marginTop: '10px 15px', 
        display: 'flex', 
        width: '100%', 
        justifyContent: 'space-around'
    },
    TxSummaryAddrBoxStyle: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start'
    },
    mainBtnsHolder: {
        width: '100%', 
        justifyContent: 'space-evenly', 
        display: 'flex'
    },
    mainBtns: () => ({
        marginTop: '20px',
        width: '200px',
        fontWeight: 700
        }),
    innerBtns: () => ({
        width: 'max-content',
        height: '25px'
        }),
    lowerBtns: () => ({
        width: '130px',
        height: '30px'
    }),
    dropDownHolder: {
        margin: '0', 
        padding: '0', 
        position: 'fixed'
    },
    initialDropDownState: {
        backgroundColor: '#7d87aa21', 
        display: 'none', 
        position: 'absolute', 
        top:'400px', 
        transition: 'all 0.5s', 
        margin: '0 20px 0 28px', 
        width: '550px', 
        height: '0px',
    },
    formattedSenderAddressHolder: {
        padding: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        borderRadius: '10px', 
        width: '100%',
        color: COLORS_DARK_THEME.SECONDARY_TEXT,
        backgroundColor: COLORS_DARK_THEME.DARK_BACKGROUND
    },
    formattedBalanceHolder: {
        padding: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        borderRadius: '10px', 
        width: '100%',
        color: COLORS_DARK_THEME.SECONDARY_TEXT,
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND
    },
    formattedRecipientAddressHolder: {
        padding: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        borderRadius: '10px', 
        width: '100%',
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND
    },
} as const