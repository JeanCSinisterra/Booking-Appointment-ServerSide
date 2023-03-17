import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";
import moment from "moment";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch(); 

    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get("/api/user/get-appointments-by-user-id", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                } 
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setAppointments(response.data.data)
            }
        }
        catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    } 

    useEffect(() => {
        getAppointmentsData()
        // eslint-disable-next-line
    }, [])


    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Doctor",
            dataIndex: "name",
            render: (text, record) => (
                <span className="normal-text">
                    {record.doctorInfo.firstName} {record.doctorInfo.lastName}
                </span>
            )
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            render: (text, record) => (
                <span className="normal-text">
                    {record.doctorInfo.phoneNumber}
                </span>
            )
        },
        {
            title: "Date & Time",
            dataIndex: "createdAt",
            render: (text, record) => (
                <span className="normal-text">
                    {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("h:mm A")}
                </span>
            )
        },
        {
            title: "status",
            dataIndex: "status"
        },
    ]

  return (
      <Layout>
          <h2 className="page-header">Appointments</h2>
          <Table columns={columns} dataSource={appointments} />
      </Layout>
  )
}

export default Appointments;