import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import BookDetails from "../../../templates/BookDetails";
import BookItem from "../../atoms/BookItem";
import Navbar from "../../../templates/Navbar";
import Footer from "../../../templates/Footer";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import {
  useGetCategoriesQuery,
  useGetProductByIdQuery,
  useGetRecommendedProductsQuery,
} from "../../../../services/bookmartApi";

export default function BookRecommend() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const bookQuery = useGetProductByIdQuery(numericId ? numericId : skipToken);
  const { data: recommended = [], isLoading: recommendationsLoading } =
    useGetRecommendedProductsQuery(numericId ? numericId : skipToken);
  const { data: categoryData = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const categories = useMemo(() => {
    const catMap: { [id: number]: string } = {};
    categoryData.forEach((cat) => {
      catMap[cat.id] = cat.name;
    });
    return catMap;
  }, [categoryData]);
  const book = bookQuery.data;
  const loading = bookQuery.isLoading || recommendationsLoading || categoriesLoading;
  const getCategoryNames = (categoryIds?: number[]) =>
    (categoryIds?.length ? categoryIds : book ? [book.category_id] : [])
      .map((categoryId) => categories[categoryId])
      .filter(Boolean);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <Navbar />
        <p className="p-6">Book not found.</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div>
        <BookDetails
          {...book}
          categoryNames={
            book.categories?.length
              ? book.categories.map((category) => category.name)
              : getCategoryNames(book.category_ids).length
                ? getCategoryNames(book.category_ids)
                : ["Unknown"]
          }
        />

        <div className="page-container pb-12">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Recommendations
            </p>
            <h2 className="text-2xl font-bold text-stone-950">
              Recommended for you
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recommended.map((recBook) => (
              <BookItem
                key={recBook.id}
                id={recBook.id}
                title={recBook.title}
                description={recBook.description}
                price={recBook.price}
                stock={recBook.stock}
                category_id={recBook.category_id}
                category_ids={recBook.category_ids}
                categories={recBook.categories}
                author={recBook.author}
                publisher={recBook.publisher}
                language={recBook.language}
                created_at={new Date(recBook.created_at)}
                imageUrl={recBook.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
