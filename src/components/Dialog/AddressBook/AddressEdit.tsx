//@ts-nocheck
import { Input }  from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from '../styles'

const AddressEdit = () => {

    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const [name, setName] = useState(dataObject.name)
    const [address, setAddress] = useState(dataObject.address)
    localStorage.setItem("addressBookAccountName", name)
    localStorage.setItem("addressBookAccountAddress", address)
    dispatchEvent(new Event("storage"))

    const handleChange = (e: any) => {

        if ( e.target.name === "addressBookAccountName") {
            setName(e.target.value)
        }

        if (e.target.name === "addressBookAccountAddress") {
            setAddress(e.target.value)
        }
        
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
                    value={name}
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
                value={address}
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

export default AddressEdit
