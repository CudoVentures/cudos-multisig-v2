import { COLORS_DARK_THEME } from "theme/colors";
import { EXPIRED } from "utils/constants";

export const styles = {
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
        width: 'max-content',
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
    scrollablePopOver: {
        overflow: 'scroll', 
        maxHeight: '250px', 
        marginBottom: '-15px'
    }
} as const