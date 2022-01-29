
import Spinner from "react-bootstrap/Spinner";

function Loading() {
  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <Spinner animation="border" variant="danger" />
    </div>
  )
}

export default Loading;