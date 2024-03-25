"use client";

import { Avatar } from "@/components/avatar";
import { Heading } from "@/components/heading";
import { Rating } from "@mui/material";
import moment from "moment";

interface ListRatingProps {
  product: any;
}

type ReviewType = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdDate: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
};

export const ListRating = ({ product }: ListRatingProps) => {
  return (
    <div>
      <Heading title="Product Reviews" />
      <div className="text-sm mt-5">
        {product.reviews &&
          product.reviews.map((review: ReviewType) => (
            <div key={review.id}>
              <div className="flex items-center gap-2">
                <Avatar src={review.user.image} />
                <div className="font-semibold">{review.user.name}A</div>
                <div className="font-light">
                  {moment(review.createdDate).fromNow()}
                </div>
              </div>
              <div className="mt-2 ml-2">
                <Rating value={review.rating} size="small" readOnly />
                <div>{review.comment}</div>
                <hr className="my-4 max-w-[500px]" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
