import Link from "next/link";
import React from "react";
import { FaLinkedin, FaTwitter, FaStethoscope } from "react-icons/fa";
import { FaSquareInstagram, FaSquareThreads } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="h-fit bg-[#0C718C] text-white">
      <div className="max-w-[1200px] w-[90%] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-0 justify-between items-center py-14">
        <div>
          <h2 className="font-semibold text-4xl">Varmasea</h2>
          <div className="flex gap-2 justify-center items-center mt-3">
            <FaLinkedin className="w-6 text-white h-6 cursor-pointer" />
            <FaTwitter className="w-6 text-white h-6 cursor-pointer" />
            <FaSquareInstagram className="w-6 text-white h-6 cursor-pointer" />
            <FaSquareThreads className="w-6 text-white h-6 cursor-pointer" />
          </div>
        </div>
        <div className="flex flex-col gap-5 md:gap-10 sm:flex-row text-gray-300">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-2xl text-white mb-2">Contact Us</h4>
            <p>+62 123 4567 890</p>
            <p>varmaseaapp@gmail.com</p>
            <p>Kuningan, Jakarta, Indonesia</p>
            <p>Mon - Fri | 10.00 - 17.00</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-2xl text-white mb-2">
              Our Services
            </h4>
            <p>Home</p>
            <p>Products</p>
            <p>Consultation</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-2xl text-white mb-2">
              Quick Links
            </h4>
            <p>About Us</p>
            <p>FAQ</p>
            <p>Contact</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-2xl text-white mb-2">
              Are you a Doctor?
            </h4>
            <div className="w-fit">
              <Link
                href={"/auth/register?user_role=doctor"}
                className="btn bg-[#e0004d] text-white border-none text-base min-h-0 h-fit p-2 px-4 flex items-center gap-2 rounded-md hover:opacity-95 hover:bg-[#e0004d]"
              >
                <FaStethoscope className="text-white font-bold" />
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
