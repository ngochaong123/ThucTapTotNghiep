import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';

interface PenaltyModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: (penalties: { returnBook_id: string, totalPenalty: number }[]) => void;  // Lưu danh sách phí phạt
}

const PenaltyModal: React.FC<PenaltyModalProps> = ({ isOpen, onRequestClose, onSave }) => {
  const [dailyPenaltyRate, setDailyPenaltyRate] = useState<number>(0); // Phí phạt hàng ngày

  useEffect(() => {
    if (isOpen) {
      setDailyPenaltyRate(0); // Reset giá trị khi mở modal
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chuyển giá trị từ chuỗi sang số và đảm bảo là số hợp lệ
    const value = e.target.value.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không phải số
    setDailyPenaltyRate(Number(value));
  };

  const handleSave = async () => {
    // Kiểm tra nếu phí phạt hợp lệ
    if (dailyPenaltyRate > 0) {
      try {
        const response = await axios.post('http://localhost:5000/calculatePenaltyForAll', {
          dailyPenaltyRate,
        });
  
        if (response.status === 200) {
          const { updatedBooks } = response.data;
          onSave(updatedBooks); // Truyền danh sách các sách với phí phạt đã tính vào hàm onSave
  
          // Hiển thị thông báo lưu thành công
          toast.success('Chỉnh sửa phí phạt thành công');
  
          // Reset trang sau khi lưu
          setTimeout(() => {
            window.location.reload(); // Tải lại trang
          }, 2000); // Đợi 2 giây để hiển thị thông báo trước khi tải lại trang
  
          onRequestClose(); // Đóng modal sau khi lưu
        }
      } catch (error) {
        console.error('Lỗi khi tính phí phạt:', error);
        toast.error('Có lỗi xảy ra khi tính phí phạt.');
      }
    } else {
      toast.warn('Vui lòng nhập phí phạt hợp lệ!');
    }
  };

  const handleCancel = () => {
    onRequestClose(); // Đóng modal khi hủy
    setDailyPenaltyRate(0); // Reset khi hủy
  };

  // Định dạng tiền Việt (VND) cho input
  const formattedValue = new Intl.NumberFormat('vi-VN').format(dailyPenaltyRate);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Nhập phí phạt"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Nhập phí phạt hàng ngày</h2>
      <div className="input-group-penalty">
        <label htmlFor="dailyPenaltyRate">Phí phạt hàng ngày</label>
        <input
          id="dailyPenaltyRate"
          type="text"
          placeholder="Nhập số tiền"
          value={formattedValue}  // Hiển thị giá trị theo định dạng tiền Việt
          onChange={handleInputChange}
        />
      </div>
      <div className="button-container">
        <button onClick={handleCancel} className="cancel-button">Hủy</button>
        <button onClick={handleSave} className="save-button">Lưu</button>
      </div>
    </Modal>
  );
};

export default PenaltyModal;
