import React from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading())
      const response = await axios.post("/api/user/register", values);
      dispatch(hideLoading())
      if (response.data.success) {
        toast.success(response.data.message); 
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcome aboard</h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="name" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="email" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

            <Button
              className="primary-button my-3 full-width-button"
              htmlType="submit"
            >
              Register
            </Button>

            <Link to="/login" className="anchor mt-2">
              Click Here to Login
            </Link>
          
        </Form>
      </div>
    </div>
  );
};

export default Register;
