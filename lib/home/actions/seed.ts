'use server'

import prisma from '@/lib/prisma'
import provincesData from '@/constants/cities.json'

export async function seed() {
  try {
    for (const provinceData of provincesData) {
      const { name, center, latitude, longitude, cities } = provinceData

      const province = await prisma.province.create({
        data: {
          name,
          center,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          cities: {
            create: cities?.map((city) => ({
              name: city.name,
              latitude: parseFloat(city.latitude),
              longitude: parseFloat(city.longitude),
            })),
          },
        },
      })

      console.log(
        `Created province: ${province?.name} with ${cities?.length} cities`
      )
    }
    console.log('Seeding completed successfully')
  } catch {
    console.log('Error seeding the database:')
  }
}
seed()
