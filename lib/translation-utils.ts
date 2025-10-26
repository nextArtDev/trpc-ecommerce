/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Language } from '@/lib/generated/prisma'

// Type for any entity that has translations
type TranslatableEntity<T> = {
  translations: T[]
}

// Type for translation objects
type TranslationFields = {
  name: string
  description?: string
}

type ProductTranslationFields = {
  name: string
  description: string
  keywords?: string
}

type SpecTranslationFields = {
  name: string
  value: string
}

type QuestionTranslationFields = {
  question: string
  answer: string
}

/**
 * Gets the translation for a specific locale from a translations array
 * @param translations - Array of translation objects
 * @param locale - The locale to get the translation for
 * @param fallbackLocale - Optional fallback locale if translation is not found
 * @returns The translation object for the specified locale or the first one as fallback
 */
export function getTranslation<T extends Record<string, any>>(
  translations: T[],
  locale: string,
  fallbackLocale?: string
): T | undefined {
  // Try to find translation for the specified locale
  let translation = translations.find((t) => t.language === locale)

  // If not found and fallback is provided, try fallback
  if (!translation && fallbackLocale) {
    translation = translations.find((t) => t.language === fallbackLocale)
  }

  // If still not found, return the first translation as ultimate fallback
  if (!translation && translations.length > 0) {
    return translations[0]
  }

  return translation
}

/**
 * Gets a specific field from a translation
 * @param translations - Array of translation objects
 * @param locale - The locale to get the translation for
 * @param field - The field to extract
 * @param fallbackValue - Optional fallback value if field is not found
 * @returns The field value or fallback
 */
export function getTranslationField<T extends Record<string, any>>(
  translations: T[],
  locale: string,
  field: keyof T,
  fallbackValue?: string
): string {
  const translation = getTranslation(translations, locale)
  const value = translation?.[field]

  return (value as string) || fallbackValue || ''
}

/**
 * Transforms an entity to include translation fields directly
 * @param entity - The entity with translations
 * @param locale - The locale to use
 * @param fallbackLocale - Optional fallback locale
 * @returns The entity with translation fields at the top level
 */
export function transformWithTranslations<
  T extends TranslatableEntity<TranslationFields>
>(
  entity: T,
  locale: string,
  fallbackLocale?: string
): Omit<T, 'translations'> & TranslationFields {
  const { translations, ...rest } = entity
  const translation = getTranslation(translations, locale, fallbackLocale)

  return {
    ...rest,
    name: translation?.name || '',
    description: translation?.description || '',
  }
}

/**
 * Transforms a product entity to include translation fields directly
 */
export function transformProductWithTranslations<
  T extends TranslatableEntity<ProductTranslationFields>
>(
  entity: T,
  locale: string,
  fallbackLocale?: string
): Omit<T, 'translations'> & ProductTranslationFields {
  const { translations, ...rest } = entity
  const translation = getTranslation(translations, locale, fallbackLocale)

  return {
    ...rest,
    name: translation?.name || '',
    description: translation?.description || '',
    keywords: translation?.keywords || '',
  }
}

/**
 * Transforms a spec entity to include translation fields directly
 */
export function transformSpecWithTranslations<
  T extends TranslatableEntity<SpecTranslationFields>
>(
  entity: T,
  locale: string,
  fallbackLocale?: string
): Omit<T, 'translations'> & SpecTranslationFields {
  const { translations, ...rest } = entity
  const translation = getTranslation(translations, locale, fallbackLocale)

  return {
    ...rest,
    name: translation?.name || '',
    value: translation?.value || '',
  }
}

/**
 * Transforms a question entity to include translation fields directly
 */
export function transformQuestionWithTranslations<
  T extends TranslatableEntity<QuestionTranslationFields>
>(
  entity: T,
  locale: string,
  fallbackLocale?: string
): Omit<T, 'translations'> & QuestionTranslationFields {
  const { translations, ...rest } = entity
  const translation = getTranslation(translations, locale, fallbackLocale)

  return {
    ...rest,
    question: translation?.question || '',
    answer: translation?.answer || '',
  }
}

/**
 * Transforms an array of entities to include translation fields
 */
export function transformArrayWithTranslations<
  T extends TranslatableEntity<TranslationFields>
>(
  entities: T[],
  locale: string,
  fallbackLocale?: string
): Array<Omit<T, 'translations'> & TranslationFields> {
  return entities.map((entity) =>
    transformWithTranslations(entity, locale, fallbackLocale)
  )
}

/**
 * Transforms an array of products to include translation fields
 */
export function transformProductsWithTranslations<
  T extends TranslatableEntity<ProductTranslationFields>
>(
  products: T[],
  locale: string,
  fallbackLocale?: string
): Array<Omit<T, 'translations'> & ProductTranslationFields> {
  return products.map((product) =>
    transformProductWithTranslations(product, locale, fallbackLocale)
  )
}

/**
 * Transforms an array of specs to include translation fields
 */
export function transformSpecsWithTranslations<
  T extends TranslatableEntity<SpecTranslationFields>
>(
  specs: T[],
  locale: string,
  fallbackLocale?: string
): Array<Omit<T, 'translations'> & SpecTranslationFields> {
  return specs.map((spec) =>
    transformSpecWithTranslations(spec, locale, fallbackLocale)
  )
}

/**
 * Transforms an array of questions to include translation fields
 */
export function transformQuestionsWithTranslations<
  T extends TranslatableEntity<QuestionTranslationFields>
>(
  questions: T[],
  locale: string,
  fallbackLocale?: string
): Array<Omit<T, 'translations'> & QuestionTranslationFields> {
  return questions.map((question) =>
    transformQuestionWithTranslations(question, locale, fallbackLocale)
  )
}

/**
 * Creates a translation hook for client components
 * @param locale - The current locale
 * @returns An object with translation helper functions
 */
export function createTranslationHelpers(
  locale: string,
  fallbackLocale = 'en'
) {
  return {
    getTranslation: <T extends Record<string, any>>(translations: T[]) =>
      getTranslation(translations, locale, fallbackLocale),

    getTranslationField: <T extends Record<string, any>>(
      translations: T[],
      field: keyof T,
      fallbackValue?: string
    ) => getTranslationField(translations, locale, field, fallbackValue),

    transformWithTranslations: <
      T extends TranslatableEntity<TranslationFields>
    >(
      entity: T
    ) => transformWithTranslations(entity, locale, fallbackLocale),

    transformProductWithTranslations: <
      T extends TranslatableEntity<ProductTranslationFields>
    >(
      entity: T
    ) => transformProductWithTranslations(entity, locale, fallbackLocale),

    transformSpecWithTranslations: <
      T extends TranslatableEntity<SpecTranslationFields>
    >(
      entity: T
    ) => transformSpecWithTranslations(entity, locale, fallbackLocale),

    transformQuestionWithTranslations: <
      T extends TranslatableEntity<QuestionTranslationFields>
    >(
      entity: T
    ) => transformQuestionWithTranslations(entity, locale, fallbackLocale),
  }
}
