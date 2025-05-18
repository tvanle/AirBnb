import React from "react";
import { FaStar } from "react-icons/fa";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
  createdAt: string;
}

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
  EditIcon,
  DeleteIcon,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 py-6 px-2 md:px-4 items-start bg-white">
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
              i < review.rating ? (
                <FaStar key={i} className="text-rose-500 text-sm" />
              ) : (
                <FaStar key={i} className="text-gray-200 text-sm" />
              )
            )}
          </span>
        </div>
        <div className="text-gray-700 mb-2">{review.comment}</div>
        <div className="text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
        </div>
      </div>
      {isOwn && (
        <div className="flex gap-2 mt-2 md:mt-0">
          {EditIcon && (
            <button
              onClick={() => onEdit(review)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow-sm border border-gray-200 transition"
              title="Chỉnh sửa"
            >
              <EditIcon className="text-base text-rose-500" />
              <span className="hidden md:inline">Sửa</span>
            </button>
          )}
          {DeleteIcon && (
            <button
              onClick={() => onDelete(review.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-rose-100 text-gray-700 font-medium shadow-sm border border-gray-200 transition"
              title="Xóa"
            >
              <DeleteIcon className="text-base text-rose-500" />
              <span className="hidden md:inline">Xóa</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
