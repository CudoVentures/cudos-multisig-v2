//@ts-nocheck
import { Input }  from '@mui/material'
import { styles } from '../styles'

const AddressInput = () => {

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        localStorage.setItem(event.target.name, event.target.value)
        dispatchEvent(new Event("storage"))
    }

    return (
        <div className='input-group' style={styles.inputGroup}>
            <div id='account-name-group' style={{display: 'grid', justifyItems: 'start'}}>
                <span style={{margin: '20px 0 10px 0'}}>Member name</span>
                <Input
                    disableUnderline
                    style={styles.addressInput}
                    type="text"
                    name="addressBookAccountName"
                    id='singleNameTab'
                    placeholder="e.g James Bond"
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div id='amount-group' style={{ display: 'grid', justifyItems: 'start', margin: 'auto 20px'}}>
                <span style={{margin: '20px 0 10px 0'}}>Account address</span>
                <Input
                disableUnderline
                style={styles.addressInput}
                type="text"
                name="addressBookAccountAddress"
                id='singleAddressTab'
                placeholder="e.g cudos1nkf0flyugd2ut40cg4tn48sp70p2e65wse8abc"
                onChange={handleChange}
                className="form-control"
                />
            </div>
        </div>
    )
}

export default AddressInput