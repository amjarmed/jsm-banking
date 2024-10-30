import Image from 'next/image';
import Link from 'next/link';
export interface LogoProps {
  isTitle?: boolean;
  styleTitle?: string;
  styleLink?: string;
  styleImage?: string;
  imageSize?: number;
  isCenter?: boolean;
}
const Logo = ({
  isTitle = true,
  styleTitle = '',
  styleLink = 'mb-0',
  styleImage = 'size-[24px] max-xl:size-14',
  imageSize = 24,
  isCenter = false,
}: LogoProps) => {
  return (
    <Link
      href='/'
      className={` cursor-pointer flex items-center gap-2 ${styleLink}${
        isCenter ? ' justify-center' : ''
      }`}
    >
      <Image
        src='/icons/logo.svg'
        alt='Horizon logo'
        width={imageSize}
        height={imageSize}
        className={styleImage}
      />
      <h1 className={isTitle ? 'sidebar-logo' : styleTitle}>Horizon</h1>
    </Link>
  );
};
export default Logo;
