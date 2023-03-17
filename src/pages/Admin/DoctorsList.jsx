import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";

const DoctorList = () => {
    // eslint-disable-next-line
    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();
    
    const getDoctorsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get("/api/admin/get-all-doctors", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setDoctors(response.data.data)
            }
        }
        catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }} 

    const changeDoctorStatus = async (record, status) => {
        try {
            dispatch(showLoading())
            const response = await axios.post("/api/admin/change-doctor-status", {doctorId: record._id , userId : record.userId , status : status}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message);
                getDoctorsData();
            }
        }
        catch (error) {
            toast.error("Error changing Doctor account status");
            dispatch(hideLoading());
        }
    }
    useEffect(() => {
        getDoctorsData()
        // eslint-disable-next-line
    }, [])

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                <span className="normal-text">{record.firstName} {record.lastName}</span>
            )
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber"
        },
        {
            title: "Created At",
            dataIndex: "createdAt"
        },
        {
            title: "status",
            dataIndex: "status"
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === "pending" && <h1 className="anchor" onClick={() => changeDoctorStatus(record, "approved")}>Approve</h1>}
                    {record.status === "approved" && <h1 className="anchor" onClick={() => changeDoctorStatus(record, "blocked")}>Block</h1>}
                </div>
            )
        }
    ]
    
    return (
        <Layout>
            <h2 className="page-header">Doctors</h2>
            <Table columns={columns} dataSource={doctors} />
        </Layout>
    )
}

export default DoctorList;