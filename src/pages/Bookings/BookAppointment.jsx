import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { Col, DatePicker, Row, TimePicker, Button } from "antd";
import moment from "moment";
import { toast } from "react-hot-toast";

const BookAppointment = () => {
  const { user } = useSelector((state) => state.user);
  // eslint-disable-next-line
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const params = useParams();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);

  // Function to get rendered the Doctor Info
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  // Function to Book appointment directly from the Button "Book Now"
  const bookNow = async () => {
    setImmediate(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error("Error booking your appointment")
      dispatch(hideLoading());
    }
  };

  // Function to check the availability of appointment
  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error("Error booking your appointment")
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      {doctor && (
        <div>
          <h3 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h3>
          <hr />
          <h4 className="normal-text">
            <b>Schedule: </b>
            {doctor.fromTime} - {doctor.toTime}
          </h4>
          <Row>
            <Col span={8} sm={24} xs={24} lg={8}>
              <div className="d-flex flex-column pt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setDate(moment(value).format("DD-MM-YYYY"))
                  }} />
                <TimePicker
                  format="h:mm A"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("h:mm A"));
                  }}
                />
                <Button className="primary-button mt-3 full-width-button" onClick={checkAvailability}>
                  Check Availability
                </Button>
                {isAvailable && (
                  <Button className="secondary-button mt-3 full-width-button" onClick={bookNow}>
                    Book Now
                  </Button>
                )
                }

              </div>
            </Col>
          </Row>

        </div>
      )}
    </Layout>
  );
};

export default BookAppointment;
