'use server'

import prisma from '@/lib/prisma'

export const getCityByProvinceId = async (provinceId: string | number) => {
  try {
    // Convert to number and validate
    const numericProvinceId =
      typeof provinceId === 'string' ? parseInt(provinceId, 10) : provinceId

    if (!provinceId || isNaN(numericProvinceId) || numericProvinceId <= 0) {
      return []
    }

    const cities = await prisma.city.findMany({
      where: {
        provinceId: numericProvinceId,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return cities
  } catch (error) {
    console.error('getCityByProvinceId error:', error)
    return []
  }
}

export const getCityById = async (cityId: string | number) => {
  try {
    // Convert to number and validate
    const numericCityId =
      typeof cityId === 'string' ? parseInt(cityId, 10) : cityId

    if (!cityId || isNaN(numericCityId) || numericCityId <= 0) {
      return null
    }

    const city = await prisma.city.findFirst({
      where: {
        id: numericCityId,
      },
    })

    return city
  } catch (error) {
    console.error('getCityById error:', error)
    return null
  }
}

export const getProvinceById = async (provinceId: string | number) => {
  try {
    // Convert to number and validate
    const numericProvinceId =
      typeof provinceId === 'string' ? parseInt(provinceId, 10) : provinceId

    if (!provinceId || isNaN(numericProvinceId) || numericProvinceId <= 0) {
      return null
    }

    const province = await prisma.province.findFirst({
      where: {
        id: numericProvinceId,
      },
    })

    return province
  } catch (error) {
    console.error('getProvinceById error:', error)
    return null
  }
}

export async function getStatesByCountryId(countryId: string) {
  try {
    const states = await prisma.state.findMany({
      where: {
        countryId,
      },
      orderBy: {
        name: 'asc',
      },
    })
    return states
  } catch (error) {
    console.error('Error fetching states:', error)
    return []
  }
}

export async function getStateById(stateId: string) {
  try {
    const state = await prisma.state.findUnique({
      where: {
        id: stateId,
      },
    })
    return state
  } catch (error) {
    console.error('Error fetching state:', error)
    return null
  }
}

export async function getAllCountries() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return countries
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  }
}
