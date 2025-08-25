import Image from 'next/image'
import Link from 'next/link'
// import bannerImage1 from '@/public/images/carousel/1.png'
// import bannerImage2 from '@/public/images/carousel/2.png'
// import bannerImage3 from '@/public/images/carousel/3.png'
import bannerImage1 from '@/public/images/pwr/1.svg'
import bannerImage2 from '@/public/images/pwr/2.svg'
import bannerImage3 from '@/public/images/pwr/3.svg'
import { ExternalLinkIcon } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'

const CarouselSection = () => {
  const banners = [
    { image: bannerImage1, link: '' },
    { image: bannerImage2, link: 'https://bet.alienzone.io/dice' },
    { image: bannerImage3, link: 'https://bet.alienzone.io/dice' },
  ]

  return (
    <Carousel
      opts={{
        loop: true,
        // @ts-expect-error 'opts' is not defined
        autoPlay: true,
        watchDrag: true,
      }}
      totalSlides={banners.length}
      className="w-full overflow-hidden rounded-xl"
    >
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem
            key={index}
            className="relative shadow-[0px_2px_8px_0px_#00000040]"
          >
            <Image
              src={banner.image}
              //   placeholder="blur"
              alt="Cover Image"
              style={{
                width: '100%',
                // height: 'auto',
                borderRadius: '0.75rem',
              }}
            />
            {banner.link ? (
              <div className="absolute bottom-[1rem] right-6 flex w-full justify-end">
                <Link
                  href={banner.link}
                  target="_blank"
                  className="z-50 overflow-hidden"
                >
                  <div className="cursor-pointer rounded-md bg-az-dark p-2.5 font-bold shadow-md transition-colors duration-500 hover:bg-az-highlight">
                    <ExternalLinkIcon className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            ) : null}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default CarouselSection
