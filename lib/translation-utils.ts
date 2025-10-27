/* eslint-disable @typescript-eslint/no-explicit-any */

// Type for any entity that has translations
export type TranslatableEntity<T> = {
  translations: T[]
}

// Type for translation objects
export type TranslationFields = {
  name: string
  description?: string
}

export type ProductTranslationFields = {
  name: string
  description: string
  keywords?: string
}

export type SpecTranslationFields = {
  name: string
  value: string
}

export type QuestionTranslationFields = {
  question: string
  answer: string
}

/**
 * Gets the translation for a specific locale from a translations array
 * Always returns the first available translation (assumes queries already filtered by locale)
 * @param translations - Array of translation objects (should only contain one translation for current locale)
 * @returns The first translation or undefined
 */
export function getTranslation<T>(translations: T[]): T | undefined {
  return translations[0]
}

/**
 * Gets a specific field from a translation
 * @param translations - Array of translation objects
 * @param field - The field to extract
 * @param fallbackValue - Optional fallback value if field is not found
 * @returns The field value or fallback
 */
export function getTranslationField<T extends Record<string, any>>(
  translations: T[],
  field: keyof T,
  fallbackValue?: string
): string {
  const translation = getTranslation(translations)
  const value = translation?.[field]

  return (value as string) || fallbackValue || ''
}

/**
 * Transforms an entity to include translation fields directly
 * @param entity - The entity with translations
 * @returns The entity with translation fields at the top level
 */
export function transformWithTranslations<
  T extends TranslatableEntity<TranslationFields>
>(entity: T): Omit<T, 'translations'> & TranslationFields {
  const { translations, ...rest } = entity
  const translation = getTranslation(translations)

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
>(entity: T): Omit<T, 'translations'> & ProductTranslationFields {
  const { translations, ...rest } = entity
  const translation = getTranslation(translations)

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
>(entity: T): Omit<T, 'translations'> & SpecTranslationFields {
  const { translations, ...rest } = entity
  const translation = getTranslation(translations)

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
>(entity: T): Omit<T, 'translations'> & QuestionTranslationFields {
  const { translations, ...rest } = entity
  const translation = getTranslation(translations)

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
>(entities: T[]): Array<Omit<T, 'translations'> & TranslationFields> {
  return entities.map((entity) => transformWithTranslations(entity))
}

/**
 * Transforms an array of products to include translation fields
 */
export function transformProductsWithTranslations<
  T extends TranslatableEntity<ProductTranslationFields>
>(products: T[]): Array<Omit<T, 'translations'> & ProductTranslationFields> {
  return products.map((product) => transformProductWithTranslations(product))
}

/**
 * Transforms an array of specs to include translation fields
 */
export function transformSpecsWithTranslations<
  T extends TranslatableEntity<SpecTranslationFields>
>(specs: T[]): Array<Omit<T, 'translations'> & SpecTranslationFields> {
  return specs.map((spec) => transformSpecWithTranslations(spec))
}

/**
 * Transforms an array of questions to include translation fields
 */
export function transformQuestionsWithTranslations<
  T extends TranslatableEntity<QuestionTranslationFields>
>(questions: T[]): Array<Omit<T, 'translations'> & QuestionTranslationFields> {
  return questions.map((question) =>
    transformQuestionWithTranslations(question)
  )
}

/**
 * Creates a translation hook for client components
 * Note: Since queries already filter by locale, we just need helpers to extract the first translation
 * @returns An object with translation helper functions
 */
export function createTranslationHelpers() {
  return {
    getTranslation: <T extends Record<string, any>>(translations: T[]) =>
      getTranslation(translations),

    getTranslationField: <T extends Record<string, any>>(
      translations: T[],
      field: keyof T,
      fallbackValue?: string
    ) => getTranslationField(translations, field, fallbackValue),

    transformWithTranslations: <
      T extends TranslatableEntity<TranslationFields>
    >(
      entity: T
    ) => transformWithTranslations(entity),

    transformProductWithTranslations: <
      T extends TranslatableEntity<ProductTranslationFields>
    >(
      entity: T
    ) => transformProductWithTranslations(entity),

    transformSpecWithTranslations: <
      T extends TranslatableEntity<SpecTranslationFields>
    >(
      entity: T
    ) => transformSpecWithTranslations(entity),

    transformQuestionWithTranslations: <
      T extends TranslatableEntity<QuestionTranslationFields>
    >(
      entity: T
    ) => transformQuestionWithTranslations(entity),
  }
}

/**
 * Helper to safely get name from translations array
 */
export function getName<T extends { name: string }>(translations: T[]): string {
  return translations[0]?.name || ''
}

/**
 * Helper to safely get description from translations array
 */
export function getDescription<T extends { description?: string }>(
  translations: T[]
): string {
  return translations[0]?.description || ''
}

/**
 * Helper for product translations
 */
export function getProductTranslation(
  translations: ProductTranslationFields[]
): ProductTranslationFields {
  return translations[0] || { name: '', description: '', keywords: '' }
}

/**
 * Helper for spec translations
 */
export function getSpecTranslation(
  translations: SpecTranslationFields[]
): SpecTranslationFields {
  return translations[0] || { name: '', value: '' }
}

/**
 * Helper for question translations
 */
export function getQuestionTranslation(
  translations: QuestionTranslationFields[]
): QuestionTranslationFields {
  return translations[0] || { question: '', answer: '' }
}
