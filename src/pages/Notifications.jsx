import Layout from "../components/Layout/Layout";
import React from "react";
import { Tabs  } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { setUser } from "../redux/userSlice";


const Notifications = () => {
    
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
    

// Function to mark read all the notifications.//
  const markAllAsRead = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/mark-all-notifications-as-read",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

//Function to delete all the notifications.
  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/delete-all-notifications",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };  

// eslint-disable-next-line
  const tabitems = [
    {
      key: "unseen",
      tab: (
        <div className="d-flex justify-content-end">
          <h3 className="anchor" onClick={() => markAllAsRead()}>
            Mark all as read
          </h3>
        </div>
      ),
      content: user?.unseenNotifications.map((notification) => (
        <div
          className="card p-2"
          onClick={() => navigate(notification.onClickPath)}
        >
          <div className="card-text">{notification.message}</div>
        </div>
      )),
    },
    {
      key: "seen",
      tab: (
        <div className="d-flex justify-content-end">
          <h3 className="anchor">Delete all</h3>
        </div>
      ),
      content: <div>Content for Seen Tab</div>,
    },
  ];


  return (
    <Layout>
       <h2>Notifications</h2>
      <Tabs>
        <tabItems tab="Unseen" key={0}>
          <div className="d-flex justify-content-end">
            <h3 className="anchor" onClick={ () => markAllAsRead() }>Mark all as read</h3>
          </div>

          {user?.unseenNotifications.map((notification) => (
            <div className="card p-2" onClick={ () => navigate (notification.onClickPath) }>
              <div className="card-text">{notification.message}</div>
            </div>
          ))}

        </tabItems>
        <tabItems tab="Seen" key={1}>
          <div className="d-flex justify-content-end">
            <h3 className="anchor" onClick={() => deleteAll()}>Delete all</h3>
          </div>
          {user?.seenNotifications.map((notification) => (
            <div className="card p-2" onClick={() => navigate(notification.onClickPath)}>
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </tabItems>
      </Tabs>
    </Layout>
  );
};


export default Notifications;