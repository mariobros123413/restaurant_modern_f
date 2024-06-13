import { Link } from 'react-router-dom';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <img
        className="headerImg"
        src="https://scontent.fvvi1-2.fna.fbcdn.net/v/t1.15752-9/448181411_834334038556433_7077227109625534536_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=aO2PWOshcm0Q7kNvgEGQVsJ&_nc_ht=scontent.fvvi1-2.fna&oh=03_Q7cD1QH7yw7LUfTJGcvvfPy0XcaLYskxjwEVzgpDT9gXwO9jog&oe=6691EB24"
        alt=""
        height={90}
      />    </LinkStyled>
  )
};

export default Logo;
