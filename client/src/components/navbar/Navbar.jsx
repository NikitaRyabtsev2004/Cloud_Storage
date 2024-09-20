import React, { useState } from "react";
import "./navbar.css";
import Logo2 from "../../assets/preloader.gif";
import { NavLink } from "react-router-dom";
import { logout } from "../../reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { showLoader } from "../../reducers/appReducer";
import { getFiles, searchFiles } from "../../actions/file";
import avatarLogo from "../../assets/avatar.svg";
import { API_URL } from "../../config";

const Navbar = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const currentDir = useSelector((state) => state.files.currentDir);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [searchName, setSearchName] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(false);

  const avatar = currentUser.avatar
    ? `${API_URL}static/${currentUser.avatar}`
    : avatarLogo;

  function searchChangeHandler(e) {
    setSearchName(e.target.value);
    if (searchTimeout !== false) {
      clearTimeout(searchTimeout);
    }
    dispatch(showLoader());
    if (e.target.value !== "") {
      setSearchTimeout(
        setTimeout(
          (value) => {
            dispatch(searchFiles(value));
          },
          500,
          e.target.value
        )
      );
    } else {
      dispatch(getFiles(currentDir));
    }
  }

  return (
    <div className="navbar">
      <div className="container">
        <div className="navbar__header">
          <NavLink style={{ textDecoration: "none", color:"white" }} to="/login">
            CLOUD
          </NavLink>
        </div>
        <img src={Logo2} alt="Preloader" className="navbar__logo" />
        {isAuth && (
          <input
            value={searchName}
            onChange={(e) => searchChangeHandler(e)}
            className="navbar__search"
            type="text"
            placeholder="Filename..."
          />
        )}
        {!isAuth && (
          <>
            <div className="navbar__login">
              <NavLink style={{ textDecoration: "none" }} to="/login">
                Login
              </NavLink>
            </div>
            <div className="navbar__registration">
              <NavLink style={{ textDecoration: "none" }} to="/registration">
                Reg
              </NavLink>
            </div>
          </>
        )}
        {isAuth && (
          <>
            <div className="navbar__logout" onClick={() => dispatch(logout())}>
              Log out
            </div>
            <NavLink to="/profile">
              <img className="navbar__avatar" src={avatar} alt="User Avatar" />
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;