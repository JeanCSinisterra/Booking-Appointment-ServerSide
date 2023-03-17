import Layout from "../../components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import DoctorForm from "../../components/DoctorForm/DoctorForm";
import moment from "moment";

const Profile = () => {
    const [doctor, setDoctor] = useState(null);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user)

    // Function to update doctor profile
    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                "/api/doctor/update-doctor-profile",
                {
                    ...values,
                    userId: user._id,
                    fromTime: moment(values.fromTime, "h:mm A"),
                    toTime: moment(values.toTime, "h:mm A")
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    }

    // Route to get rendered the Doctor Info
    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                "/api/doctor/get-doctor-info-by-user-id",
                {
                    userId: params.userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctor(response.data.data)
            }
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
        }
    };
    
    useEffect(() => {
        getDoctorData();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout>
            <h3 className='page-title'>Doctor Profile</h3>
            <hr />
            {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
            {/* <DoctorForm onFinish={onFinish} initialValues={doctor} /> */}
        </Layout>
    )
}

export default Profile;