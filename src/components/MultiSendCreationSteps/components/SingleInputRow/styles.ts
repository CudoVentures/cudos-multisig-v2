/* eslint-disable import/prefer-default-export */
export const styles = {
    walletInput: {
        width: '470px', 
        height: '50px', 
        backgroundColor: '#28314E', 
        fontSize: '90%', 
        paddingLeft: '20px',
        borderRadius: '5px'
    },
    inputGroup: {
        display: "flex", 
        marginBottom: '15px',
        flexDirection: "row", 
        alignItems: "flex-end",
        justifyContent: 'space-between',
        width: '100%'
    },
    amountInput: {
        width: '100px', 
        height: '50px', 
        backgroundColor: '#28314E', 
        fontSize: '90%', 
        padding: '20px',
        borderRadius: '5px'
    },
    denomInput: {
        width: '140px', 
        height: '50px', 
        backgroundColor: '#28314E', 
        fontSize: '90%', 
        padding: '20px',
        borderRadius: '5px'
    },
    addToListButton: {
        height: '40px',
        width: '140px',
    },
    changeBtn: {
        textDecoration: 'none',
        height: '40px',
        width: 'max-content',
        position: 'absolute',
        top: '10px'
    }
} as const