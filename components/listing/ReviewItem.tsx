import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaEllipsisV, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import type { Review } from "@/types";

interface ReviewItemProps {
  review: Review;
  isOwn: boolean;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
  EditIcon?: React.ComponentType<{ className?: string }>;
  DeleteIcon?: React.ComponentType<{ className?: string }>;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  isOwn,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click ngoài
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleEdit = () => {
    setEditing(true);
    setMenuOpen(false);
  };

  const handleEditSubmit = () => {
    onEdit({ ...review, comment: editComment, rating: editRating });
    setEditing(false);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 py-6 px-2 md:px-4 items-start bg-white relative">
      <div className="flex-shrink-0">
        {review.user.image ? (
          <img
            src={review.user.image}
            alt={review.user.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
            {review.user.name?.[0] || "?"}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-800">{review.user.name}</span>
          <span className="flex items-center gap-0.5 ml-2">
            {[...Array(5)].map((_, i) =>
              i < (editing ? editRating : review.rating) ? (
                <FaStar key={i} className="text-rose-500 text-sm" />
              ) : (
                <FaStar key={i} className="text-gray-200 text-sm" />
              )
            )}
          </span>
        </div>
        {editing ? (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) =>
                star <= editRating ? (
                  <FaStar
                    key={star}
                    className="text-xl text-rose-500 cursor-pointer"
                    onClick={() => setEditRating(star)}
                  />
                ) : (
                  <FaStar
                    key={star}
                    className="text-xl text-gray-300 cursor-pointer"
                    onClick={() => setEditRating(star)}
                  />
                )
              )}
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              rows={3}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              maxLength={500}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditSubmit}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-sm transition"
                title="Lưu"
              >
                <FaCheck /> OK
              </button>
              <button
                onClick={handleEditCancel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow-sm transition"
                title="Hủy"
              >
                <FaTimes /> Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-700 mb-2">{review.comment}</div>
        )}
        <div className="text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
        </div>
      </div>
      {isOwn && !editing && (
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Tùy chọn"
            type="button"
          >
            <FaEllipsisV className="text-lg text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                <FaEdit className="text-rose-500" /> Sửa
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(review.id);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-b-lg"
              >
                <FaTrash className="text-rose-500" /> Xóa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
