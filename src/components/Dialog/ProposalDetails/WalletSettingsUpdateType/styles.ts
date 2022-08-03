import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    infoIcon: {
        marginLeft: '5px', 
        height: '15px'
    },
    tooltip: {
        maxHeight: '200px', 
        maxWidth: '300px', 
        overflow: 'auto'
    },
    link: {
        marginRight: '5px',
        fontWeight: '600px',
        textDecoration: 'none'
    },
    icons: {
        marginLeft: '10px',
        cursor: 'pointer'
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
    }
} as const