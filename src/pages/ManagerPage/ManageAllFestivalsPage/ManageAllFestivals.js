import React, { useState, useEffect } from "react";
import { Card, Button, Table, Modal, Form, Input, Descriptions, Image, List, Input as SearchInput } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/Manager/ManageAllFestivals.scss";
import ManageAllFestivalsService from "../../../services/ManageServicePages/ManageAllFestivalsService/ManageAllFestivalsService";

const ManageAllFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const data = await ManageAllFestivalsService.getAllEvents(searchTerm);
        setFestivals(data);
      } catch (error) {
        toast.error(error.message || "Failed to load festivals");
      }
    };
    fetchFestivals();
  }, [searchTerm]);

  const showCreateModal = () => {
    setIsEditMode(false);
    setSelectedFestival(null);
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setSelectedFestival(record);
    form.setFieldsValue({
      eventId: record.eventId,
      eventName: record.eventName,
      description: record.description,
      startDate: record.startDate.split("T")[0],
      endDate: record.endDate.split("T")[0],
      location: record.location,
    });
    setIsCreateModalVisible(true);
  };

  const showDetailsModal = async (record) => {
    try {
      const eventData = await ManageAllFestivalsService.getEventById(record.eventId);
      const cosplayers = await Promise.all(
        eventData.eventCharacterResponses.map(async (ec) => {
          const cosplayer = await ManageAllFestivalsService.getCosplayerByEventCharacterId(
            ec.eventCharacterId
          );
          return {
            eventCharacterId: ec.eventCharacterId,
            name: cosplayer.name,
            description: cosplayer.description || "No description",
            urlImage: cosplayer.images.find((img) => img.isAvatar)?.urlImage || cosplayer.images[0]?.urlImage,
          };
        })
      );
      setEventDetails({ ...eventData, cosplayers });
      setIsDetailsModalVisible(true);
    } catch (error) {
      toast.error(error.message || "Failed to load event details");
    }
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsDetailsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const festivalData = {
        ...values,
        startDate: values.startDate || "2025-01-01",
        endDate: values.endDate || values.startDate,
      };

      if (isEditMode) {
        const updatedFestivals = festivals.map((f) =>
          f.eventId === selectedFestival.eventId ? { ...f, ...festivalData } : f
        );
        setFestivals(updatedFestivals);
        toast.success("Festival updated successfully!");
      } else {
        festivalData.eventId = `E${(festivals.length + 1).toString().padStart(3, "0")}`;
        setFestivals([...festivals, festivalData]);
        toast.success("Festival created successfully!");
      }
      setIsCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error("Failed to save festival");
    }
  };

  const handleDelete = (eventId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this festival?",
      onOk: () => {
        setFestivals(festivals.filter((f) => f.eventId !== eventId));
        toast.success("Festival deleted successfully!");
      },
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (text.length > 50 ? `${text.slice(0, 50)}...` : text),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => text.split("T")[0],
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => text.split("T")[0],
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            size="small"
            onClick={() => showEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => handleDelete(record.eventId)}
            style={{ marginRight: 8 }}
          >
            Delete
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => showDetailsModal(record)}
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-festivals">
      <h2 className="manage-festivals-title">Manage Festivals</h2>
      <div className="content-container">
        <Card className="manage-festivals-card">
          <div className="table-header">
            <SearchInput
              placeholder="Search by event name"
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: 300, marginBottom: 16 }}
              size="large"
            />
            <Button
              type="primary"
              size="large"
              onClick={showCreateModal}
              style={{ marginBottom: 16, float: "right" }}
            >
              Create Festival
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={festivals}
            rowKey="eventId"
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>

      <Modal
        title={isEditMode ? "Edit Festival" : "Create Festival"}
        open={isCreateModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            eventId: "",
            eventName: "",
            description: "",
            startDate: "2025-01-01",
            endDate: "2025-01-01",
            location: "",
          }}
        >
          <Form.Item
            name="eventId"
            label="Event ID"
            rules={[{ required: !isEditMode, message: "Please enter event ID" }]}
          >
            <Input disabled={isEditMode} placeholder="E001" size="large" />
          </Form.Item>
          <Form.Item
            name="eventName"
            label="Event Name"
            rules={[{ required: true, message: "Please enter event name" }]}
          >
            <Input placeholder="New Year Festival" size="large" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea placeholder="Event description" size="large" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please enter start date" }]}
          >
            <Input type="date" size="large" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please enter end date" }]}
          >
            <Input type="date" size="large" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Times Square" size="large" />
          </Form.Item>
          <Form.Item>
            <div className="form-actions">
              <Button type="primary" htmlType="submit" size="large">
                {isEditMode ? "Update" : "Create"}
              </Button>
              <Button
                type="default"
                size="large"
                onClick={handleCancel}
                style={{ marginLeft: 8 }}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<span style={{ fontSize: "26px", fontWeight: 600 }}>Event Details</span>}
        open={isDetailsModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {eventDetails && (
          <div>
            <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>Event Images</h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {eventDetails.eventImageResponses.map((img) => (
                <Image key={img.imageId} src={img.imageUrl} width={150} />
              ))}
            </div>

            <Descriptions
              title={<span style={{ fontSize: "22px", fontWeight: 600 }}>Event Information</span>}
              bordered
              column={1}
              style={{ marginTop: 16 }}
            >
              <Descriptions.Item label="Event Name">{eventDetails.eventName}</Descriptions.Item>
              <Descriptions.Item label="Description">{eventDetails.description}</Descriptions.Item>
              <Descriptions.Item label="Location">{eventDetails.location}</Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {new Date(eventDetails.startDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {new Date(eventDetails.endDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Create Date">
                {new Date(eventDetails.createDate).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>

            <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>Activities</h3>
            <List
              dataSource={eventDetails.eventActivityResponse}
              renderItem={(activity) => (
                <List.Item>
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Name">{activity.activity.name}</Descriptions.Item>
                    <Descriptions.Item label="Description">{activity.description}</Descriptions.Item>
                  </Descriptions>
                </List.Item>
              )}
            />

            <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>Cosplayers</h3>
            <List
              dataSource={eventDetails.cosplayers}
              renderItem={(cosplayer) => (
                <List.Item>
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Name">{cosplayer.name}</Descriptions.Item>
                    <Descriptions.Item label="Description">{cosplayer.description}</Descriptions.Item>
                    <Descriptions.Item label="Image">
                      <Image src={cosplayer.urlImage} width={100} />
                    </Descriptions.Item>
                  </Descriptions>
                </List.Item>
              )}
            />

            <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>Tickets</h3>
            <List
              dataSource={eventDetails.ticket}
              renderItem={(ticket) => (
                <List.Item>
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Type">
                      {ticket.ticketType === 0 ? "Normal" : "Premium"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">{ticket.description}</Descriptions.Item>
                    <Descriptions.Item label="Quantity">{ticket.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Price">{ticket.price.toLocaleString()} VND</Descriptions.Item>
                  </Descriptions>
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageAllFestivals;