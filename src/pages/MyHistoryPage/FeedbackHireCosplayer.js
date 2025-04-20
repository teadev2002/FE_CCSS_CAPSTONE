/////////////// fix ===========================================
import React, { useState, useEffect } from "react";
import { Form, Rate, Input, Button, Modal } from "antd";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import { toast } from "react-toastify";

const { TextArea } = Input;

const FeedbackHireCosplayer = ({
  contractId,
  contractCharacters,
  accountId,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cosplayerNames, setCosplayerNames] = useState({});
  const [feedbacks, setFeedbacks] = useState({}); // Lưu feedback cho từng cosplayer

  // Lấy tên cosplayer từ API dựa trên cosplayerId
  useEffect(() => {
    const fetchCosplayerNames = async () => {
      try {
        const names = {};
        for (const character of contractCharacters) {
          if (character.cosplayerId) {
            try {
              const cosplayerData =
                await MyHistoryService.gotoHistoryByAccountId(
                  character.cosplayerId
                );
              names[character.cosplayerId] = cosplayerData?.name || "Unknown";
            } catch (error) {
              console.warn(
                `Failed to fetch cosplayer data for ID ${character.cosplayerId}:`,
                error
              );
              names[character.cosplayerId] = "Unknown";
            }
          }
        }
        setCosplayerNames(names);
      } catch (error) {
        console.error("Failed to fetch cosplayer names:", error);
        toast.error("Không thể tải thông tin cosplayer.");
      }
    };

    fetchCosplayerNames();
  }, [contractCharacters]);

  // Cập nhật feedback khi người dùng thay đổi star hoặc description
  const handleFeedbackChange = (cosplayerId, field, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [cosplayerId]: {
        ...prev[cosplayerId],
        contractCharacterId: contractCharacters.find(
          (char) => char.cosplayerId === cosplayerId
        ).contractCharacterId,
        [field]: value,
      },
    }));
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    // Kiểm tra xem tất cả cosplayer đã được feedback chưa
    const missingFeedbacks = contractCharacters.filter(
      (char) =>
        !feedbacks[char.cosplayerId] || !feedbacks[char.cosplayerId].star // star là bắt buộc
    );

    // Nếu có cosplayer chưa được feedback, yêu cầu confirm
    if (missingFeedbacks.length > 0) {
      Modal.confirm({
        title: "Xác nhận gửi Feedback",
        content: (
          <div>
            <p>
              Bạn chưa đánh giá các cosplayer sau:{" "}
              {missingFeedbacks
                .map(
                  (char) => cosplayerNames[char.cosplayerId] || char.cosplayerId
                )
                .join(", ")}
              .
            </p>
            <p>
              Hệ thống sẽ tự động gán 5 sao cho các cosplayer này. Bạn có chắc
              chắn muốn tiếp tục?
            </p>
          </div>
        ),
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          await submitFeedback(missingFeedbacks);
        },
      });
    } else {
      await submitFeedback([]);
    }
  };

  // Hàm gửi feedback
  const submitFeedback = async (missingFeedbacks) => {
    setLoading(true);
    try {
      // Tạo danh sách feedback
      const feedbackData = contractCharacters.map((char) => {
        const feedback = feedbacks[char.cosplayerId] || {};
        return {
          contractCharacterId: char.contractCharacterId,
          star: feedback.star || 5, // Gán mặc định 5 sao nếu không có feedback
          description: feedback.description || "",
        };
      });

      // Gửi request tới API
      await MyHistoryService.createFeedback(accountId, contractId, {
        feedbacks: feedbackData,
      });

      toast.success("Gửi feedback thành công!");
      form.resetFields();
      setFeedbacks({});
      onCancel(); // Đóng modal
      window.location.reload();
    } catch (error) {
      console.error(
        "Error submitting Feedback:",
        error.response?.data || error.message
      );
      toast.error("Gửi feedback thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Feedback cho tất cả Cosplayer</h3>
      {contractCharacters.map((char) => (
        <div
          key={char.cosplayerId}
          style={{
            marginBottom: 24,
            padding: 16,
            border: "1px solid #f0f0f0",
            borderRadius: 4,
          }}
        >
          <h4>{cosplayerNames[char.cosplayerId] || char.cosplayerId}</h4>
          <Form.Item label="Đánh giá">
            <Rate
              value={feedbacks[char.cosplayerId]?.star || 0}
              onChange={(value) =>
                handleFeedbackChange(char.cosplayerId, "star", value)
              }
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label="Mô tả">
            <TextArea
              rows={4}
              value={feedbacks[char.cosplayerId]?.description || ""}
              onChange={(e) =>
                handleFeedbackChange(
                  char.cosplayerId,
                  "description",
                  e.target.value
                )
              }
              placeholder="Nhập mô tả feedback của bạn"
            />
          </Form.Item>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          Gửi Feedback
        </Button>
      </div>
    </div>
  );
};

export default FeedbackHireCosplayer;
