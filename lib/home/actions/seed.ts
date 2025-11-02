'use server'

import prisma from '@/lib/prisma'
import provincesData from '@/constants/cities.json'
import countries from '@/constants/countries.json'
import countriesData from '@/constants/country.json'
import statesData from '@/constants/state.json'
export async function seed() {
  try {
    // for (const provinceData of provincesData) {
    //   const { name, center, latitude, longitude, cities } = provinceData

    //   const province = await prisma.province.create({
    //     data: {
    //       name,
    //       center,
    //       latitude: parseFloat(latitude),
    //       longitude: parseFloat(longitude),
    //       cities: {
    //         create: cities?.map((city) => ({
    //           name: city.name,
    //           latitude: parseFloat(city.latitude),
    //           longitude: parseFloat(city.longitude),
    //         })),
    //       },
    //     },
    //   })

    //   console.log(
    //     `Created province: ${province?.name} with ${cities?.length} cities`
    //   )
    // }

    // console.log('Seeding completed successfully')
    // for (const country of countries) {
    //   await prisma.country.upsert({
    //     where: { code2: country.code2 },
    //     update: {
    //       code3: country.code3,
    //       name: country.name,
    //     },
    //     create: {
    //       code2: country.code2,
    //       code3: country.code3,
    //       name: country.name,
    //     },
    //   })
    // }

    // console.log('Countries seeded successfully')

    // // Then, create all states
    // for (const country of countries) {
    //   const countryRecord = await prisma.country.findUnique({
    //     where: { code2: country.code2 },
    //   })

    //   if (countryRecord && country.states.length > 0) {
    //     for (const state of country.states) {
    //       await prisma.state.upsert({
    //         where: {
    //           code_countryId: {
    //             code: state.code,
    //             countryId: countryRecord.id,
    //           },
    //         },
    //         update: {
    //           name: state.name,
    //           // Fix: Ensure subdivision is a string or null, not an array
    //         },
    //         create: {
    //           code: state.code,
    //           name: state.name,
    //           // Fix: Ensure subdivision is a string or null, not an array

    //           countryId: countryRecord.id,
    //         },
    //       })
    //     }
    //   }
    // }

    // console.log('States seeded successfully')
    // Create a map of old country IDs to new UUIDs
    const countryIdMap = new Map<string, string>()

    // Seed countries
    console.log('Seeding countries...')
    for (const country of countriesData) {
      const existingCountry = await prisma.country.findUnique({
        where: { sortname: country.sortname },
      })

      if (existingCountry) {
        countryIdMap.set(country.id, existingCountry.id)
        console.log(`Country ${country.name} already exists, skipping...`)
      } else {
        const createdCountry = await prisma.country.create({
          data: {
            sortname: country.sortname,
            name: country.name,
          },
        })
        countryIdMap.set(country.id, createdCountry.id)
        console.log(`Created country: ${country.name}`)
      }
    }

    // Seed states
    console.log('Seeding states...')
    let statesCreated = 0
    let statesSkipped = 0

    for (const state of statesData) {
      const newCountryId = countryIdMap.get(state.country_id)

      if (!newCountryId) {
        console.warn(
          `Country ID ${state.country_id} not found for state ${state.name}, skipping...`
        )
        statesSkipped++
        continue
      }

      // Check if state already exists
      const existingState = await prisma.state.findFirst({
        where: {
          name: state.name,
          countryId: newCountryId,
        },
      })

      if (existingState) {
        statesSkipped++
        continue
      }

      await prisma.state.create({
        data: {
          name: state.name,
          countryId: newCountryId,
        },
      })
      statesCreated++

      // Log progress every 100 states
      if (statesCreated % 100 === 0) {
        console.log(`Created ${statesCreated} states...`)
      }
    }

    console.log('\n✅ Seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`  - Countries: ${countriesData.length}`)
    console.log(`  - States created: ${statesCreated}`)
    console.log(`  - States skipped: ${statesSkipped}`)
  } catch {
    console.log('Error seeding the database:')
  }
}
seed()
