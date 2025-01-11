import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "@/utils/helpers/svgicon";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`py-20 relative ${className}`}>
      <div className='container mx-auto px-4'>
        <div className='flex flex-wrap justify-between gap-8 z-10'>
          {/* Company Info Section */}
          <div className='space-y-6 '>
            <Link href='/' className='inline-block'>
              <img
                src='/assets/logo/logo.png'
                alt='Logo'
                className='h-16 max-md:h-20'
              />
            </Link>

            <p className='text-gray-600 mb-6'>
              Discover your unique scent with us.
            </p>

            {/* Contact Information */}
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white'>
                  <MapPin className='w-5 h-5' />
                </span>
                <span className='text-gray-900'>Kathmandu, Nepal</span>
              </div>

              <div className='flex items-center gap-4'>
                <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white'>
                  <Phone className='w-5 h-5' />
                </span>
                <div className='flex items-center flex-wrap gap-2'>
                  <a
                    href='tel:+9779811787940'
                    className='text-gray-900 hover:text-primary transition-colors'
                  >
                    +977 9811787940
                  </a>
                  <span className='text-primary'>or</span>
                  <a
                    href='tel:+9779811787940'
                    className='text-gray-900 hover:text-primary transition-colors'
                  >
                    +977 9811787940
                  </a>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <span className='w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white'>
                  <Mail className='w-5 h-5' />
                </span>
                <a
                  href='mailto:support24@sugandha.com'
                  className='text-gray-900 hover:text-primary transition-colors'
                >
                  support24@sugandha.com
                </a>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className='space-y-6'>
            <h6 className='text-lg font-semibold mb-6'>Information</h6>
            <ul className='space-y-4'>
              <li>
                <Link
                  href='/products'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/products'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support Section */}
          <div>
            <h6 className='text-lg font-semibold mb-6'>Customer Support</h6>
            <ul className='space-y-4'>
              <li>
                <Link
                  href='/products'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='/products'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Policies & Rules
                </Link>
              </li>
              <li>
                <Link
                  href='/products'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Online Shopping
                </Link>
              </li>
            </ul>
          </div>

          {/* My Account Section */}
          <div>
            <h6 className='text-lg font-semibold mb-6'>My Account</h6>
            <ul className='space-y-4'>
              <li>
                <Link
                  href='/products'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href='/order-history'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href='/cart'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href='/wishlist'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h6 className='text-lg font-semibold mb-6'>Shop on The Go</h6>
            <p className='text-gray-600 mb-4'>
              Our brand is available on social media. Get your perfume now.
            </p>
            <ul className='flex gap-4'>
              {[
                {
                  href: "https://www.facebook.com",
                  icon: <Facebook className='w-5 h-5' />,
                },
                {
                  href: "https://www.twitter.com",
                  icon: <Twitter className='w-5 h-5' />,
                },
                {
                  href: "https://www.instagram.com",
                  icon: <Instagram className='w-5 h-5' />,
                },

                {
                  href: "https://www.linkedin.com",
                  icon: <Linkedin className='w-5 h-5' />,
                },
              ].map((social, index) => (
                <li key={index}>
                  <Link
                    href={social.href}
                    className='w-11 h-11 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors'
                  >
                    {social.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <img
        src='assets/images/bg/footer.jpeg'
        alt='Background'
        className='absolute inset-0 w-full h-full object-cover opacity-10 z-[-1]'
      />
    </footer>
  );
};

export default Footer;
