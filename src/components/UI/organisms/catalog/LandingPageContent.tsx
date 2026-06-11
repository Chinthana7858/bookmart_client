import { IoIosArrowForward } from "react-icons/io";
import Navbar from "../../../templates/Navbar";
import Footer from "../../../templates/Footer";
import { useEffect } from "react";
import BookItem from "../../atoms/BookItem";
import { Link, useLocation } from "react-router-dom";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { motion } from "framer-motion";
import { useGetPopularProductsQuery } from "../../../../services/bookmartApi";

const generateSessionId = () => crypto.randomUUID();

export default function LandingPage() {
  const { data: books = [], isLoading: loading, isError } = useGetPopularProductsQuery();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [location]);

  useEffect(() => {
    if (isError) console.error("Failed to fetch books");
  }, [isError]);

  useEffect(() => {
    const hasSession = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("guest_session_id="));

    if (!hasSession) {
      document.cookie = `guest_session_id=${generateSessionId()}; path=/; max-age=86400`;
    }
  }, []);

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <section className="border-b border-stone-200 bg-white">
        <div className="page-container grid min-h-[560px] items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
              Online book store
            </p>
            <h1 className="text-4xl font-bold leading-tight text-stone-950 sm:text-5xl lg:text-6xl">
              BookMart
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              Browse a focused collection of books, track what readers explore,
              and discover recommendations shaped by real activity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/home" className="btn-primary">
                Browse books
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                >
                  <IoIosArrowForward size={22} />
                </motion.span>
              </Link>
              <Link to="/#about" className="btn-secondary">
                Learn more
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://i.imgur.com/Rchj22e.png"
              alt="BookMart book selection"
              className="mx-auto w-full max-w-2xl rounded-lg object-contain"
            />
          </div>
        </div>
      </section>

      <section className="page-container py-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Reader activity
            </p>
            <h2 className="text-2xl font-bold text-stone-950">Popular books</h2>
          </div>
          <Link to="/home" className="text-sm font-semibold text-primary hover:text-primarydark">
            See all books
          </Link>
        </div>

        {loading ? (
          <div className="py-14">
            <LoadingSpinner />
          </div>
        ) : books.length === 0 ? (
          <div className="surface py-14 text-center text-stone-500">
            Popular books will appear after readers start browsing.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => (
              <BookItem key={book.id} {...book} created_at={new Date(book.created_at)} />
            ))}
          </div>
        )}
      </section>

      <section id="about" className="border-y border-stone-200 bg-white py-14">
        <div className="page-container grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              About
            </p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">Built for simple book shopping</h2>
          </div>
          <p className="max-w-3xl text-base leading-7 text-stone-600">
            BookMart is a sample online bookstore that demonstrates product
            browsing, recommendations, cart workflows, user accounts, and
            admin management in a full-stack application.
          </p>
        </div>
      </section>

      <section id="contact" className="page-container py-14">
        <div className="surface grid gap-8 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Contact
            </p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">Get in touch</h2>
          </div>
          <div className="grid gap-5 text-sm text-stone-600 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-stone-900">Email</h3>
              <p className="mt-1 break-words">chinthanaprabhashitha@gmail.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Phone</h3>
              <p className="mt-1">+94 70 657 4222</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Address</h3>
              <p className="mt-1">123 Main Street, Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
