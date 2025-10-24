// import React from 'react'
// import ProductCard from './product-card'
// import Link from 'next/link'

// const items = [
//   {
//     id: '2',
//     title: 'medium handbag with double flap in grained leather',
//     imageSrc: [
//       '/images/bag-2.webp',
//       '/images/bag-5.webp',
//       '/images/bag-3.webp',
//       '/images/bag-4.webp',
//     ],
//     category: 'Emilie',
//     link: '/products/1',
//     price: 690,
//     colors: ['#451144', '#000000', '#81212'],
//   },
//   {
//     id: '3',
//     title: 'Louise small tote bag in grained leather',
//     imageSrc: [
//       '/images/bag-3.webp',
//       '/images/bag.webp',
//       '/images/bag1.webp',
//       '/images/bag-4.webp',
//     ],
//     category: 'Louise',
//     link: '/products/1',
//     price: 570,
//     colors: ['#81212', '#451144', '#000'],
//   },
//   {
//     id: '4',
//     title: 'medium-sized handbag in grained leather',
//     imageSrc: [
//       '/images/bag-4.webp',
//       '/images/bag-2.webp',
//       '/images/bag-3.webp',
//       '/images/bag1.webp',
//     ],
//     category: 'Emilie',
//     link: '/products/1',
//     price: 580,
//     colors: ['#000', '#451144', '#81212'],
//   },
//   {
//     id: '5',
//     title: 'medium handbag in smooth leather and nubuck',
//     imageSrc: [
//       '/images/bag-5.webp',
//       '/images/bag-3.webp',
//       '/images/bag-2.webp',
//       '/images/bag-4.webp',
//     ],
//     category: 'Juliette',
//     link: '/products/1',
//     price: 670,
//     colors: ['#451144', '#000', '#81212'],
//   },
//   {
//     id: '6',
//     title: 'small handbag in grained leather',
//     imageSrc: [
//       '/images/bag.webp',
//       '/images/bag-2.webp',
//       '/images/bag-3.webp',
//       '/images/bag-4.webp',
//     ],
//     category: 'Juliette',
//     link: '/products/1',
//     price: 750,
//     colors: ['#000000', '#451144', '#81212'],
//   },
//   {
//     id: '1',
//     title: 'medium handbag with double flap in grained leather',
//     imageSrc: [
//       '/images/bag-2.webp',
//       '/images/bag-5.webp',
//       '/images/bag-3.webp',
//       '/images/bag-4.webp',
//     ],
//     category: 'Emilie',
//     link: '/products/1',
//     price: 690,
//     colors: ['#451144', '#000000', '#81212'],
//   },
//   {
//     id: '7',
//     title: 'Louise small tote bag in grained leather',
//     imageSrc: [
//       '/images/bag-3.webp',
//       '/images/bag.webp',
//       '/images/bag1.webp',
//       '/images/bag-4.webp',
//     ],
//     category: 'Louise',
//     link: '/products/1',
//     price: 570,
//     colors: ['#81212', '#451144', '#000'],
//   },
//   {
//     id: '8',
//     title: 'medium-sized handbag in grained leather',
//     imageSrc: [
//       '/images/bag-4.webp',
//       '/images/bag-2.webp',
//       '/images/bag-3.webp',
//       '/images/bag1.webp',
//     ],
//     category: 'Emilie',
//     link: '/products/1',
//     price: 580,
//     colors: ['#000', '#451144', '#81212'],
//   },
//   {
//     id: '9',
//     title: 'medium handbag in smooth leather and nubuck',
//     imageSrc: [
//       '/images/bag-5.webp',
//       '/images/bag-3.webp',
//       '/images/bag-2.webp',
//       '/images/bag-4.webp',
//     ],
//     category: 'Juliette',
//     link: '/products/1',
//     price: 670,
//     colors: ['#451144', '#000', '#81212'],
//   },
//   {
//     id: '10',
//     title: 'small handbag in grained leather',
//     imageSrc: [
//       '/images/bag.webp',
//       '/images/bag-2.webp',
//       '/images/bag-3.webp',
//       '/images/bag-4.webp',
//     ],
//     category: 'Juliette',
//     link: '/products/1',
//     price: 750,
//     colors: ['#000000', '#451144', '#81212'],
//   },
// ]
// function ProductGrid() {
//   return (
//     <div className="py-12 px-0.5 mx-auto md:container w-full h-full grid gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
//       {items.map((item) => (
//         <Link href={'/products/1'} key={item.id}>
//           <ProductCard  product={item} />
//         </Link>
//       ))}
//     </div>
//   )
// }

// export default ProductGrid
