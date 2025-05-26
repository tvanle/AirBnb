"use client";
import Pagination from "@/components/Pagination";
import ListingCard from "@/components/listing/ListingCard";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface PaginationWrapperProps {
  listings: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  currentUser: any;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  listings,
  total,
  currentPage,
  totalPages,
  limit,
  currentUser,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(limit));
    router.push("?" + params.toString());
  };

  return (
    <Container>
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8 overflow-x-hidden">
        {listings.map((list) => (
          <ListingCard key={list.id} data={list} currentUser={currentUser} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default PaginationWrapper;

