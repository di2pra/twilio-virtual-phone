import NavDropdown from "react-bootstrap/NavDropdown";
import { IPhoneTwilio } from "../../Types";

type Props = {
  phoneList: IPhoneTwilio[],
  selectedPhone: IPhoneTwilio | null
  updateSelectedPhone: (item: IPhoneTwilio) => void
}

function PhoneDropdown({ phoneList , selectedPhone, updateSelectedPhone } : Props) {

  if(!selectedPhone) {
    return null
  }

  return (
    <NavDropdown disabled={phoneList.length === 1} title={`${selectedPhone.alias} (${selectedPhone.number})`} id="basic-nav-dropdown">
      {
        phoneList.map((item, index) => {
          if (item.phone_id === selectedPhone.phone_id) {
            return null
          }
          return <NavDropdown.Item onClick={() => { updateSelectedPhone(item) }} key={index}>{item.alias} ({item.number})</NavDropdown.Item>
        })
      }
    </NavDropdown>
  );

}

export default PhoneDropdown;