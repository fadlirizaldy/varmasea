import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdOutlineHealthAndSafety,
} from "react-icons/md";
import { GiStethoscope } from "react-icons/gi";
import { IoInformationCircle } from "react-icons/io5";

type SliderContentPropsType = {
  id: number;
  title: string;
  desc: string;
  link: string;
  icon?: React.ReactElement;
  activeSlide: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
};

const Slider = () => {
  const [activeSlide, setactiveSlide] = useState(1);

  const next = () => setactiveSlide(activeSlide === 2 ? 0 : activeSlide + 1);

  const prev = () => setactiveSlide(activeSlide === 0 ? 2 : activeSlide - 1);

  const getStyles = (index: number) => {
    if (activeSlide === index)
      return {
        opacity: 1,
        transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
        zIndex: 10,
      };
    else if (activeSlide - 1 === index)
      return {
        opacity: 1,
        transform: "translateX(-240px) translateZ(-400px) rotateY(35deg)",
        zIndex: 9,
      };
    else if (activeSlide + 1 === index)
      return {
        opacity: 1,
        transform: "translateX(240px) translateZ(-400px) rotateY(-35deg)",
        zIndex: 9,
      };
    else if (activeSlide - 2 === index)
      return {
        opacity: 1,
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        zIndex: 8,
      };
    else if (activeSlide + 2 === index)
      return {
        opacity: 1,
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 8,
      };
    else if (index < activeSlide - 2)
      return {
        opacity: 0,
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        zIndex: 7,
      };
    else if (index > activeSlide + 2)
      return {
        opacity: 0,
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 7,
      };
  };

  return (
    <>
      <div className="slideC">
        {data.map((item, i) => (
          <React.Fragment key={item.id}>
            <div
              className="slide"
              style={{
                background: item.bgColor,
                boxShadow: `0 5px 20px ${item.bgColor}30`,
                ...getStyles(i),
              }}
            >
              <SliderContent
                {...item}
                activeSlide={activeSlide}
                setActive={setactiveSlide}
              />
            </div>
            <div
              className="reflection"
              style={{
                background: `linear-gradient(to bottom, ${item.bgColor}40, transparent)`,
                ...getStyles(i),
              }}
            />
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-center gap-5 relative z-50">
        <MdKeyboardArrowLeft
          size={40}
          className="mt-10 border border-slate-200 rounded-lg cursor-pointer"
          onClick={prev}
        />
        <MdKeyboardArrowRight
          size={40}
          className="mt-10 border border-slate-200 rounded-lg cursor-pointer"
          onClick={next}
        />
      </div>
    </>
  );
};

const SliderContent = (props: SliderContentPropsType) => {
  const router = useRouter();
  return (
    <div
      className="sliderContent cursor-pointer"
      onClick={() => {
        if (props.activeSlide === props.id) {
          return router.push(props.link);
        }
        props.setActive(props.id);
      }}
    >
      <div className="flex gap-4 items-center">
        {props.icon}
        <h2 className="font-semibold text-2xl">{props.title}</h2>
      </div>

      <p className="line-clamp-3">{props.desc}</p>
    </div>
  );
};

const data = [
  {
    id: 0,
    bgColor: "#7952B3",
    title: "Stay healthy with vitamin",
    desc: "Fulfill your vitamin intake needs to maintain your immune system",
    link: "/products",
    icon: <MdOutlineHealthAndSafety size={50} />,
  },
  {
    id: 1,
    bgColor: "#1597BB",
    title: "Get cold? Consultation here!",
    desc: "Check your health here. Get a doctor who fits your criteria",
    link: "/doctors",
    icon: <GiStethoscope size={50} />,
  },
  {
    id: 2,
    bgColor: "#185ADB",
    title: "Get to know about Varmasea",
    desc: "Still have question what is varmasea? Here where you get what Varmasea is",
    link: "/about-us",
    icon: <IoInformationCircle size={50} />,
  },
];
export default Slider;
