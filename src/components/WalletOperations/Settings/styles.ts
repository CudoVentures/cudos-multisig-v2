import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    btnHolder: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardsHolder: {
        display: 'flex',
        backgroundColor: 'inherit',
        height: '512px',
        marginTop: '10px',
        width: '100%',
    },
    boxHolder: {
        height: '100%',
    },
    defaultCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '50%',
        height: 'max-content'
    },
    defaultTitle: {
        fontWeight: '600',
    },
    defaultSubtitle: {
        color: COLORS_DARK_THEME.SECONDARY_TEXT,
        fontWeight: '400',
        textAlign: 'left',
    },
    defaultInfoBox: {
        overflow: 'scroll',
        maxHeight: '280px',
        wordBreak: "break-word",
        textAlign: 'left',
        width: '100%',
        borderRadius: '5px',
        padding: '15px 15px 0 15px',
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
        fontWeight: '500'
    },
    infoHolder: {
        textAlign: 'left',
        width: '100%',
        marginTop: '20px'
    },
} as const
