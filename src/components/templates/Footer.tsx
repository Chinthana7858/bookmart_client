import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-stone-200 bg-white">
      <div className="page-container relative z-10 pb-28 pt-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="BookMart"
              className="h-10 w-10 rounded-md object-contain"
            />
            <span className="text-base font-bold text-stone-950">BookMart</span>
          </Link>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
            <li>
              <Link className="hover:text-primary" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/home">
                Books
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/#about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/#contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-6 border-t border-stone-200 pt-5 text-sm text-stone-500">
          Curated books, simple shopping, and recommendations shaped by what readers explore.
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-36">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 82C140 64 273 66 406 116C554 172 725 161 889 138C1069 112 1248 69 1440 0V220H0V82Z"
            fill="#FFD84D"
          />
          <path
            d="M0 111C164 91 321 95 471 139C650 191 814 176 990 148C1166 120 1286 83 1440 38V220H0V111Z"
            fill="#FFAA3D"
            opacity="0.9"
          />
          <path
            d="M0 151C161 122 337 119 514 151C714 187 911 178 1114 143C1246 121 1353 91 1440 69V220H0V151Z"
            fill="#FF7A32"
            opacity="0.95"
          />
          <path
            d="M0 170C175 139 339 137 497 160C710 191 927 191 1149 158C1271 140 1370 115 1440 93V220H0V170Z"
            fill="#F25A2E"
            opacity="0.9"
          />
        </svg>
      </div>
    </footer>
  );
}
