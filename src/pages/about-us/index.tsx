import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import Image from "next/image";
import React from "react";
import { FaStethoscope } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";

const AboutUsPage = () => {
  return (
    <div className="max-w-[1200px] w-[90%] mx-auto py-14 relative">
      <h2 className="text-primary_blue font-bold text-3xl flex items-center gap-2">About us</h2>

      <div className="flex items-center justify-center w-full mt-10 gap-3 animate-fade-up animate-once animate-delay-100">
        <Image src={`${GCP_PUBLIC_IMG}/icon_logo.png`} alt={"Varmasea logo"} width={50} height={50} />
        <h2 className="font-medium text-3xl">Varmasea</h2>
      </div>

      <div className="text-center mt-4 text-lg text-slate-500 animate-fade-up animate-once animate-delay-150">
        <p>
          <span className="text-black font-medium">Welcome to Varmasea,</span> where your health takes center stage. At
          Varmasea, we seamlessly blend the convenience of online medicine purchasing with expert medical consultations,
          all in one innovative platform. Our application offers a diverse range of pharmaceuticals, ensuring you have
          easy access to the medications you need. Beyond that, our users can connect with our experienced team of
          doctors for personalized consultations, providing a holistic health solution tailored to your individual
          needs. We believe in empowering you to take charge of your well-being, and our tagline, &quot;Find Your Health
          Solution,&quot; reflects our commitment to being your trusted partner on your journey to a healthier and
          happier life. With Varmasea, discover a world where health meets technology, ensuring that your wellness is
          just a click away.
        </p>
      </div>

      <div className="inline-flex items-center justify-center w-full animate-fade-up animate-once animate-delay-150">
        <hr className="w-64 h-1 my-8 bg-gray-200 border-0 rounded dark:bg-gray-700" />
        <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
          <svg
            className="w-4 h-4 text-gray-700 dark:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-center animate-fade-up animate-once animate-delay-300">
        <h2 className="font-medium text-xl">Our Service</h2>
      </div>

      <div className="flex justify-center gap-20 mt-7 animate-fade-up animate-once animate-delay-300">
        <div className="p-4 rounded-md border border-slate-300 shadow-md w-72 flex flex-col items-center">
          <h3 className="font-medium text-lg">Medicine</h3>
          <div className="p-2 rounded-full mt-2 border border-slate-200 mb-4">
            <GiMedicines size={45} />
          </div>
          <p className="text-center text-slate-500">
            We prioritize your well-being by providing access to essential medicines right in your neighborhood. Our
            commitment is to ensure that you can conveniently obtain the medications you need, bringing the pharmacy to
            your doorstep.
          </p>
        </div>
        <div className="p-4 rounded-md border border-slate-300 shadow-md w-72 flex flex-col items-center">
          <h3 className="font-medium text-lg">Telemedicine</h3>
          <div className="p-2 rounded-full mt-2 border border-slate-200 mb-4">
            <FaStethoscope size={45} />
          </div>
          <p className="text-center text-slate-500">
            We desire to connecting you with experienced and caring doctors through convenient virtual consultations.
            Our platform is designed to make healthcare accessible and personalized, allowing you to consult with a
            qualified medical professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
AboutUsPage.title = "About | Varmasea";
