interface OfferCardProps {
  backgroundImage?: string;
  modelImage?: string;
  discount?: string;
  onShopNow?: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  backgroundImage = "/bg-pattern.jpg",
  modelImage = "/model-image.jpg",
  discount = "85%",
  onShopNow,
}) => {
  return (
    <div className='min-w-[320px] sm:w-[400px] md:w-[448px] h-auto relative rounded-3xl border border-orange-600 overflow-hidden bg-gray-100 px-2 flex justify-center item-center'>
      {/* Background Pattern - absolute positioned to cover */}
      <div
        className='absolute inset-0 bg-cover bg-center opacity-10'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Content Container */}
      <div className='relative h-auto flex flex-col md:flex-row items-center justify-center py-3'>
        {/* Model Image - Left Side */}
        <div className='h-full flex items-end'>
          <img
            src={modelImage}
            alt='Summer collection model'
            className='h-[232px] md:h-[432px] object-cover object-center'
          />
        </div>
        {/* Text Content - Right Side */}
        <div className='flex-1 py-4 md:py-12 md:pr-4 text-center md:text-right'>
          <h3 className='text-base font-semibold text-gray-900 uppercase mb-2'>
            New offer
          </h3>
          <p className='text-[33px] font-bold text-gray-900 font-quicksand mb-8'>
            Get {discount} Off
          </p>
          <button
            onClick={onShopNow}
            className='md:w-36 px-6 py-3 md:px-4 md:py-2 bg-gray-900 text-white rounded-full border border-gray-900 
                       hover:bg-gray-800 transition-colors inline-flex items-center gap-1'
          >
            Shop Now
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='ml-2'
            >
              <path
                d='M4.16666 10H15.8333'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M10 4.16669L15.8333 10L10 15.8334'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;

