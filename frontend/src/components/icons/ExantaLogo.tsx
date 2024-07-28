import Image from 'next/image';
import logo from '../../../public/exanta_logo_transparentbg.png'; // Adjust the path accordingly

interface ExantaLogoProps {
  width?: number;
  heigth?: number;
}

const ExantaLogo = ({ width, heigth }: ExantaLogoProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Image
        src={logo}
        alt="Exanta Logo"
        width={width ?? 150}
        height={heigth ?? 150}
      />
    </div>
  );
};

export default ExantaLogo;
