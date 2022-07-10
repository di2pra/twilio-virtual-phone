import NavDropdown from "react-bootstrap/NavDropdown";
import { IPhone } from "../../Types";

type Props = {
  phoneList: IPhone[],
  selectedPhone: IPhone | null
  updateSelectedPhone: (item: IPhone) => void
}

function PhoneDropdown({ phoneList, selectedPhone, updateSelectedPhone }: Props) {

  if (!selectedPhone) {
    return null
  }

  return (
    <NavDropdown disabled={phoneList.length === 1} title={`${selectedPhone.friendlyName} (${selectedPhone.phoneNumber})`} id="basic-nav-dropdown">
      {
        phoneList.map((item, index) => {
          if (item.sid === selectedPhone.sid) {
            return null
          }
          return <NavDropdown.Item onClick={() => { updateSelectedPhone(item) }} key={index}>{item.friendlyName} ({item.phoneNumber})</NavDropdown.Item>
        })
      }
    </NavDropdown>
  );

}

export default PhoneDropdown;