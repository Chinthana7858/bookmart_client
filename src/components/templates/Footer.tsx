import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="bg-[#ffcba4] text-gray-700 px-6 py-10">
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
      <div className="flex items-center gap-2 mb-6 md:mb-0">
        <div className="w-6 h-6 bg-primary rounded-sm" />
        <span className="text-lg font-bold">Book Mart</span>
      </div>

      <ul className="flex flex-wrap gap-6 justify-center text-sm">
         <Link to={"/"}>
        <li>Home</li></Link>
         <Link to="/#about">
        <li>About us</li></Link>
        <Link to={"/home"}>
        <li>Books</li></Link>
         <Link to="/#contact">
        <li>Contact us</li></Link>
      </ul>
    </div>

    <div className="border-t border-gray-400 my-6" />

  </footer>
  )
}
