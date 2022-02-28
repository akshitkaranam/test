// import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import SearchBox from './SearchBox'
import { logout } from "../store/actions/userActions";
import { useAppSelector } from "../store/hooks";

export function Header() {
  const dispatch = useDispatch();

  const userLogin = useAppSelector((state) => state.userLogin);
  //@ts-ignore
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <>
      <p>username: {userInfo.username}</p>
      <p>email: {userInfo.email}</p>
      <p>id: {userInfo.id}</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={logoutHandler}>
        Log Out
      </button>
    </>
  );
}

export default Header;
