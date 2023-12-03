import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface CarouselItemProps {
  img: string;
  title: string;
  description: string;
  linkTo: string;
}

const CustomCarouselItem: React.FC<CarouselItemProps> = ({ img, title, description, linkTo }) => {
  return (
    <Carousel.Item>
      <img className="img-box" style={{ height: '700px' }} src={img} alt="Carousel slide" />
      <Carousel.Caption>
        <div className="detail-box">
          <h1>{title}</h1>
          <p>{description}</p>
          <Link to={linkTo}>Start Shopping</Link>
        </div>
      </Carousel.Caption>
    </Carousel.Item>
  );
};

export default CustomCarouselItem;