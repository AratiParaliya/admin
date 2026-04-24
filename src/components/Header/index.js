import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Button from "@mui/material/Button";
import {
  MdMenuOpen,
  MdOutlineLightMode,
  MdOutlineMailOutline,
  MdOutlineMenu,
} from "react-icons/md";
import { IoCartOutline, IoShieldHalfSharp } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import SearchBox from "../SearchBox";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import { useContext, useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { MyContext } from "../../App";
import UserAvatarImg from "../userAvatarimg";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpennotificationsDrop, setisOpennotificationsDrop] = useState(false);
  const open = Boolean(anchorEl);
  const opennotifications = Boolean(isOpennotificationsDrop);

  const handleOpenMyAccDrop = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMyAccDrop = () => setAnchorEl(null);
  const handleOpennotificationsDrop = () => setisOpennotificationsDrop(true);
  const handleClosenotificationsDrop = () => setisOpennotificationsDrop(false);

  /* ── Toggle sidebar (works for both desktop & mobile) ── */
  const handleSidebarToggle = () => {
    context.setIsToggleSidebar(!context.isToggleSidebar);
  };

  return (
    <header className="d-flex align-items-center">
      <div className="container-fluid w-100">
        <div className="d-flex align-items-center w-100" style={{ gap: 0 }}>

          {/* ── Logo ── */}
          <div className="part1" style={{ flexShrink: 0 }}>
            <Link to={"/"} className="d-flex align-items-center">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          {/* ── Hamburger + Search ── */}
          <div className="d-flex align-items-center part2" style={{ flexShrink: 0 }}>
            {/* Hamburger always visible */}
            <Button
              className="rounded-circle mr-3"
              onClick={handleSidebarToggle}
              title="Toggle Sidebar"
            >
              {context.isToggleSidebar === false ? (
                <MdMenuOpen />
              ) : (
                <MdOutlineMenu />
              )}
            </Button>

            {/* Search box — desktop only */}
            {context.windowWidth > 992 && <SearchBox />}
          </div>

          {/* ── Right actions — pushed to far right ── */}
          <div className="d-flex align-items-center part3" style={{ marginLeft: "auto", flexShrink: 0 }}>
            {/* Theme toggle */}
            <Button
              className="rounded-circle mr-3"
              onClick={() => context.setThemeMode(!context.themeMode)}
            >
              <MdOutlineLightMode />
            </Button>

        

            {/* My Account */}
            <div className="myAccWrapper">
              <Button
                className="myAcc d-flex align-items-center"
                onClick={handleOpenMyAccDrop}
              >
                <div>
                  <UserAvatarImg
                    img={
                      user?.avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAa5feWGju95NLmf97imfDRjqJ1OhbK7DZEg&s"
                    }
                  />
                </div>
                <div className="userInfo">
                  <h4>{user?.name || "Guest User"}</h4>
                  <p className="mb-0">
                    {user?.role === "admin" ? "Admin" : "User"}
                  </p>
                </div>
              </Button>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleCloseMyAccDrop}
                onClick={handleCloseMyAccDrop}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {user && (
                  <MenuItem onClick={() => navigate(`/myAccount/${user._id}`)}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    My Account
                  </MenuItem>
                )}

                <MenuItem
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    context.setisLogin(false);
                    window.open("https://sh0pkart.netlify.app/SignIn", "_self");
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>

        </div>
      </div>
    </header>

  );
};

export default Header;