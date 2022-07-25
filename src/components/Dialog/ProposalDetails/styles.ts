import { COLORS_DARK_THEME } from "theme/colors";
import { EXPIRED } from "utils/constants";

export const styles = {
    icons: {
        marginLeft: '10px',
        cursor: 'pointer'
    },
    backDrop: {
        style: {
            backgroundColor: 'transparent',
            backdropFilter: "blur(6px)",
            opacity: 0.8
        }
    },
    paperProps: {
        sx: {
            border: 'none',
            maxWidth: '1030px',
            minWidth: '1030px',
            width: '100%',
            height: '610px',
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: '25px'
        }
    },
    modalContainer: {
        boxShadow: 'none',
        padding: '35px 50px 50px 50px',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND
    },
    btnHolderBox: {
        marginTop: '60px',
        display: 'flex',
        justifyContent: 'space-evenly',
        float: 'right',
        width: '40%'
    },
    votingBtns: () => ({
        width: '150px',
        height: '50px',
        fontWeight: 700
    }),
    executingBtn: () => ({
        height: '50px',
        width: '250px',
        fontWeight: 700
    }),
    leftContainerBox: {
        position: 'relative',
        flexDirection: 'column',
        alignContent: 'flex-start',
        maxHeight: '100%',
        float: 'left',
        width: '60%',
        display: 'flex'
    },
    separatingBorder: {
        margin: '30px 20px',
        position: 'absolute',
        right: '10px',
        borderRight: '1px solid rgba(99, 109, 143, 0.2)',
        height: '300px'
    },
    componentHolderBox: {
        backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND,
        borderRadius: '20px',
        padding: '20px 20px 20px 40px',
        width: '550px',
        display: 'block'
    },
    recipientsBox: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    typoHolder: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '5px'
    },
    swiperCard: {
        marginTop: '5px',
        borderRadius: '10px',
        paddingTop: '0',
        backgroundColor: 'rgba(99, 109, 143, 0.1)',
        height: '140px',
        width: '90%'
    },
    votersBox: {
        padding: '0px 20px',
        width: '100%',
        flexDirection: 'column',
        height: '100px',
        overflow: 'scroll',
        position: 'absolute',
        top: '70px',
        display: 'flex'
    },
    approvalNeededInfoBox: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        padding: '0 20px',
        margin: '0px 20px',
        position: 'absolute',
        top: '180px',
        height: '40px',
        width: '90%',
        borderRadius: '20px',
        backgroundColor: 'rgba(27, 32, 49, 1)'
    },
    expiredInfoBox: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        padding: '0 20px',
        margin: '0px 20px',
        position: 'absolute',
        top: '280px',
        height: '40px',
        width: '92%',
        borderRadius: '20px',
        backgroundColor: EXPIRED.color
    },
    rejectedInfoBox: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        padding: '0 20px',
        margin: '0px 20px',
        position: 'absolute',
        top: '280px',
        height: '40px',
        width: '82%',
        borderRadius: '20px',
        backgroundColor: 'rgba(234, 97, 97, 0.2)'
    },
    executedInfoAddressBox: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        position: 'absolute',
        top: '260px',
        height: '40px',
        width: '73%',
    },
    executedInfoTimeBox: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        position: 'absolute',
        top: '290px',
        height: '40px',
        width: '72%',
    },
    verticalLineSteps: {
        width: '100%',
        position: 'relative',
        float: 'left',
        height: '250px',
        boxSizing: 'border-box',
        borderLeft: "2px solid #7D87AA"
    },
    vertialStepsHolder: {
        float: 'right',
        width: '38%',
        height: '100%',
        padding: '50px 0'
    },
    expirationHolder: {
        maxHeight: '100%',
        float: 'right',
        width: '40%',
        display: 'flex',
        alignItems: 'center'
    }
} as const