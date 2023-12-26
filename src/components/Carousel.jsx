import React from "react";
import { useRef, useImperativeHandle } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/carousel.css";

const Carousel = React.forwardRef(({ items }, ref) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    // infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // centerMode: true,
    // centerPadding: "0%",
    // adaptiveHeight: true,
    touchMove: false,
};

  useImperativeHandle(ref, () => ({
    goToSlide: (index) => {
      sliderRef.current.slickGoTo(index);
    }
  }));

  const wrapperStyle = {
    // overflowX: "hidden",
    // overflowY: "hidden",
  };

  const itemStyle = {
    // maxWidth: "100%",
    // width: "100%",
  };

  return (
    <div className="carousel-wrapper" style={wrapperStyle}>
      <Slider ref={sliderRef} {...settings}>
        {items.map((item, index) => (
          <div key={index} style={itemStyle}>{item}</div>
        ))}
      </Slider>
    </div>
  );
});

export default Carousel;
