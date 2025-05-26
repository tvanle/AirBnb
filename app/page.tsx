import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listing/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import { redirect } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import PaginationWrapper from "@/components/PaginationWrapper";

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page = 1, limit = 10, ...restParams } = searchParams || {};
  const { listings, total } = await getListings({ ...restParams, page: Number(page), limit: Number(limit) });
  const currentUser = await getCurrentUser();
  const totalPages = Math.ceil(total / Number(limit));
  const currentPage = Number(page);

  // Nếu là admin thì redirect sang /admin
  if (currentUser?.role === "ADMIN") {
    redirect("/admin");
  }

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PaginationWrapper
        listings={listings}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        limit={Number(limit)}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
