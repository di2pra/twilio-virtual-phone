import NavDropdown from "react-bootstrap/NavDropdown";
import { IPhone } from "../../hooks/useApi";

type IPhoneDropdownProps = {
  phoneList: IPhone[],
  selectedPhone: IPhone | null
  updateSelectedPhone: (item: IPhone) => void
}

function PhoneDropdown({ phoneList , selectedPhone, updateSelectedPhone } : IPhoneDropdownProps) {

  if(!selectedPhone) {
    return null
  }

  return (
    <NavDropdown title={`${selectedPhone.alias} (${selectedPhone.number})`} id="basic-nav-dropdown">
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