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
    console.log('getProvinceById error:', error)
    return null
  }
}

export const getStatesByCountryId = async (countryId: string) => {
  try {
    if (!countryId) {
      return []
    }

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
    console.error('getStatesByCountryId error:', error)
    return []
  }
}

export const getStateById = async (stateId: string) => {
  try {
    if (!stateId) {
      return null
    }

    const state = await prisma.state.findFirst({
      where: {
        id: stateId,
      },
    })

    return state
  } catch (error) {
    console.error('getStateById error:', error)
    return null
  }
}
