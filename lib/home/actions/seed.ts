'use server'

import prisma from '@/lib/prisma'
import provincesData from '@/constants/cities.json'
import countries from '@/constants/countries.json'

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
    for (const country of countries) {
      await prisma.country.upsert({
        where: { code2: country.code2 },
        update: {
          code3: country.code3,
          name: country.name,
        },
        create: {
          code2: country.code2,
          code3: country.code3,
          name: country.name,
        },
      })
    }

    console.log('Countries seeded successfully')

    // Then, create all states
    for (const country of countries) {
      const countryRecord = await prisma.country.findUnique({
        where: { code2: country.code2 },
      })

      if (countryRecord && country.states.length > 0) {
        for (const state of country.states) {
          await prisma.state.upsert({
            where: {
              code_countryId: {
                code: state.code,
                countryId: countryRecord.id,
              },
            },
            update: {
              name: state.name,
              // Fix: Ensure subdivision is a string or null, not an array
            },
            create: {
              code: state.code,
              name: state.name,
              // Fix: Ensure subdivision is a string or null, not an array

              countryId: countryRecord.id,
            },
          })
        }
      }
    }

    console.log('States seeded successfully')
  } catch {
    console.log('Error seeding the database:')
  }
}
seed()
