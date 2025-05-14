import { IoIosArrowForward } from "react-icons/io";
import Navbar from "../templates/Navbar";
import Footer from "../templates/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../const/api_paths";
import type { Book } from "../../types/book";
import BookItem from "../UI/atoms/BookItem";
import { Link, useLocation } from "react-router-dom";
import LoadingSpinner from "../UI/atoms/LoadingSpinner";
import { motion } from "framer-motion";

const generateSessionId = () => crypto.randomUUID();

export default function LandingPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [location]);

  useEffect(() => {
    const fetchPopularBooks = () => {
      axios
        .get(API.GET_POPULAR_PRODUCTS, {
          withCredentials: true,
        })

        .then((res) => {
          console.log(res);
          setBooks(res.data);
        })
        .catch((err) => console.error("Failed to fetch books:", err))
        .finally(() => setLoading(false));
    };

    fetchPopularBooks();
  }, []);

  useEffect(() => {
    const hasSession = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("guest_session_id="));

    if (!hasSession) {
      const sessionId = generateSessionId();
      document.cookie = `guest_session_id=${sessionId}; path=/; max-age=86400`;
    }
  }, []);

  return (
    <div className="">
      <Navbar />
      {/* First section */}

      <section>
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-10 py-4 bg-secondary">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-6 ">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-700 leading-snug">
              Find your next great read at
              <br /> our online book store
            </h2>
            <p className="text-gray-600">Explore our current collection</p>
            <Link to={"/home"}>
              <button className="bg-primary hover:bg-primarydark text-white px-16 py-2 rounded-xl cursor-pointer">
                <div className="flex items-center gap-2 font-xl">
                  Let's start!
                  <motion.div
                    animate={{ x: [0, 25] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 1,
                      ease: "easeInOut",
                    }}
                  >
                    <IoIosArrowForward size={25} />
                  </motion.div>
                </div>
              </button>
            </Link>
          </div>

          {/* Right Image */}

          <div className="lg:w-1/2 relative flex justify-center">
            {/* Background split */}
            <div className="absolute inset-0 flex z-0">
              <div className="w-1/2 bg-transparent"></div>
              <div className="w-1/2 bg-white"></div>
            </div>

            {/* Image on top */}
            <img
              src="https://i.imgur.com/Rchj22e.png"
              alt="Hero"
              className="w-full relative z-10"
            />
          </div>
        </div>
      </section>
      {/* Second section */}

      <section>
        <div className=" ">
          {loading ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <div className=" p-5">
              <h2 className="text-2xl font-bold mb-4 text-gray-700 p-2">
                Popular Books
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {books.map((book) => {
                  const date = new Date(book.created_at);
                  return (
                    <Link to={`/book/${book.id}`}>
                      <BookItem
                        key={book.id}
                        imageUrl={book.imageUrl}
                        title={book.title}
                        description={book.description}
                        price={book.price}
                        id={book.id}
                        stock={book.stock}
                        category_id={book.category_id}
                        created_at={date}
                      />
                    </Link>
                  );
                })}
              </div>
              <Link to={"/home"}>
                <button className="bg-primary hover:bg-primarydark text-white px-16 py-2 rounded-xl cursor-pointer mt-4">
                  <div className=" flex font-xl">
                    See more...
                    <motion.div
                      animate={{ x: [0, 25] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 1,
                        ease: "easeInOut",
                      }}
                    >
                      <IoIosArrowForward size={25} />
                    </motion.div>
                  </div>
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
      <section id="about" className="bg-white py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">About Us</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Welcome to <span className="font-semibold">BookMart</span> — a sample
          online bookstore created for demonstration purposes. . It was built as
          part of an assignment to showcase web development, UI design, and
          full-stack integration skills.
          <br />
          <br />
          BookMart simulates a modern book shopping experience, complete with
          product listings, recommendations, cart, and user account features.
        </p>
      </section>

      <section
        id="contact"
        className="bg-gray-50 py-16 px-6 md:px-20 text-center"
      >
        <h2 className="text-3xl font-bold text-primary mb-4">Contact Us</h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-6">
          Have questions, suggestions, or just want to say hi? We'd love to hear
          from you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-8 text-gray-600">
          <div>
            <h4 className="font-semibold text-lg">Email</h4>
            <p>chinthanaprabhashitha@gmail.com</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Phone</h4>
            <p>+94 70 657 4222</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Address</h4>
            <p>123 Main Street, Colombo, Sri Lanka</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
