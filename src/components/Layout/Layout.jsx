import React, { useState } from "react";
import "./layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    // user Menu is an Object variable to place the links of the sidebar menu
    const userMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-bar-chart-horizontal-fill"
        },
        {
            name: "Appointments",
            path: "/appointments",
            icon: "ri-calendar-2-line"
        },
        {
            name: "Apply Doctor",
            path: "/apply-doctor",
            icon: "ri-hospital-line"
        },
        {
            name: "Profile",
            path: "/profile",
            icon: "ri-user-settings-line"
        }
    ];

    const adminMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-bar-chart-horizontal-fill"
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: "ri-user-line"
        },
        {
            name: "Doctors",
            path: "/admin/doctorslist",
            icon: "ri-user-heart-line"
        },
        {
            name: "Profile",
            path: "/profile",
            icon: "ri-user-settings-line"
        }
    ];

    const doctorMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-bar-chart-horizontal-fill"
        },
        {
            name: "Appointments",
            path: "/appointments",
            icon: "ri-calendar-2-line"
        },
        {
            name: "Profile",
            path: `/doctor/profile/${user?._id}`,
            icon: "ri-user-settings-line"
        }
    ];


    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
    const roleKeyword = user?.isAdmin ? "Manager" : user?.isDoctor ? "Doctor" : "User";


    return (
        <div className="main">
            <div className="d-flex layout">
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h2 className="title-sidebar">CliniDoc</h2>
                        <h2 className="roleKeyword">{roleKeyword}</h2>
                    </div>

                    <div className="menu">
                        {menuToBeRendered.map((menuKey) => {
                            const isActive = location.pathname === menuKey.path;
                            // this line is for putting a shadow on the menu if it is selected
                            return (
                                <div
                                    className={`d-flex menu-item ${isActive && "active-menu-item"}`}

                                >
                                    {/* // the line below hide the links paths if the sidebar is collapsed // */}
                                    <i className={menuKey.icon}></i>
                                    {!collapsed && <Link to={menuKey.path} >{menuKey.name}</Link>}
                                </div>
                            );
                        })}
                        <div className={`d-flex menu-item`} onClick={() => {
                            localStorage.clear()
                            navigate("/login")
                        }}>
                            <i className="ri-logout-circle-line"></i>
                            {!collapsed && <Link to="/login">Logout</Link>}
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="header">
                        {!collapsed ? (<i className="ri-close-line header-action-icon" onClick={() => setCollapsed(true)}></i>
                        ) : (
                            <i className="ri-menu-2-fill header-action-icon" onClick={() => setCollapsed(false)}></i>
                            )}

                        <div className="d-flex align-items-center px-4">
                            <Badge count={user?.unseenNotifications.length} onClick={()=> navigate("/notifications")}>
                                <i className="ri-notification-3-line header-action-icon px-2 mr-2"></i>    
                            </Badge>
                            
                            <Link to="/profile" className="anchor mx-2">{user?.name}</Link>
                        </div>
                    </div>
                    <div className="body">
                        {children}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Layout;