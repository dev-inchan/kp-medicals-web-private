// components/ImageCarousel.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Image = {
  src: string;
  alt: string;
};

type Props = {
  images: Image[];
  className?: string;
};

const ImageCarousel = ({ images, className }: Props) => {
  return (
    <Swiper spaceBetween={50} slidesPerView={1} pagination={{ clickable: true }} loop={true}>
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img className={className} src={image.src} alt={image.alt} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
