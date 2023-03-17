import React from 'react'
import { Button, Col, Form, Input, Row, TimePicker} from "antd";
import moment from "moment";

const DoctorForm = ({ onFinish, initialValues }) => {
  const fromTime = moment(initialValues.fromTime, "h:mm A");
  const toTime = moment(initialValues.toTime, "h:mm A");
  console.log("fromTime", fromTime);
  console.log("toTime", toTime);
  return (
    <Form layout="vertical" onFinish={onFinish} initialValues={{
      ...initialValues,
      ...(initialValues && {
        fromTime,
        toTime
      })
    }}>
      <h4 className="card-title mt-3">Personal Information</h4>
      <Row gutter={20}>
        {/* First Name */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        {/* Last Name */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        {/* Phone Number */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </Col>
        {/* Address */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
      </Row>

      <hr />

      {/* Profesional Information */}
      <h4 className="card-title mt-3">Professional Information</h4>
      <Row gutter={20}>
        {/* Specialization */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </Form.Item>
        </Col>
        {/* Fee Per consultation */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Consultation Fee"
            name="feePerConsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Amount $" type="number" />
          </Form.Item>
        </Col>
        {/* Years of Experience */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Years of Experience"
            name="yearsOfExperience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Years of Experience" type="number" />
          </Form.Item>
        </Col>
        {/* Schedule - fromTime */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="From"
            name="fromTime"
            rules={[{ required: true }]}
          >
            <TimePicker format="h:mm A" />
          </Form.Item>
        </Col>
        {/* Schedule - toTime */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="To"
            name="toTime"
            rules={[{ required: true }]}
          >
            <TimePicker format="h:mm A" />
          </Form.Item>
        </Col>
      </Row>
      <div className="d-flex justify-content-center">
        <Button className="primary-button" htmlType="submit">Submit</Button>
      </div>

    </Form>

  )
}

export default DoctorForm;