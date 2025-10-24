/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import {
  Control,
  FieldArrayWithId,
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
  Path,
  useWatch,
} from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ColorPicker } from './color-picker'
import colorNamer from 'color-namer'

// --- Type Definitions ---
type FormValues = any
type FieldName = Path<FormValues>
type ArrayItem<T> = T extends (infer U)[] ? U : never
type DetailSchemaType = ArrayItem<
  FormValues['variants' | 'specs' | 'questions']
>

// --- Component Props Interface ---
interface ClickToAddInputsRHFProps {
  fields: FieldArrayWithId<FormValues, FieldName, 'id'>[]
  name: FieldName
  control: Control<FormValues>
  register: UseFormRegister<FormValues>
  setValue: UseFormSetValue<FormValues>
  getValues: UseFormGetValues<FormValues>
  onAppend: (value: Partial<DetailSchemaType>) => void
  onRemove: (index: number) => void
  initialDetailSchema: Partial<DetailSchemaType>
  header?: string
  containerClassName?: string
  inputClassName?: string
  labels?: Record<string, string>
  isMandatory?: boolean
}

// --- Component Implementation ---
const ClickToAddInputsRHF: React.FC<ClickToAddInputsRHFProps> = ({
  fields,
  name,
  control, // Make sure control is passed here
  register,
  setValue,
  onAppend,
  onRemove,
  initialDetailSchema,
  header,
  containerClassName,
  inputClassName,
  labels,
  isMandatory = false,
}) => {
  // 2. Watch the entire array of variants for changes
  const watchedValues = useWatch({
    control,
    name,
  })

  const handleAddDetail = () => {
    onAppend(initialDetailSchema)
  }

  const handleRemoveDetail = (index: number) => {
    onRemove(index)
  }

  return (
    <div className="flex flex-col gap-y-4">
      {header && <Label className="text-md font-semibold">{header}</Label>}

      {fields.map((fieldItem, index) => {
        // We no longer need this, as we'll get values from watchedValues
        // const currentDetail = fieldItem as unknown as DetailSchemaType

        return (
          <div
            key={fieldItem.id}
            className={cn(
              'grid grid-cols-4 items-end gap-3 border p-4 rounded-md relative',
              containerClassName
            )}
          >
            {Object.keys(initialDetailSchema).map((propertyKey) => {
              const fieldPath =
                `${name}.${index}.${propertyKey}` as Path<FormValues>
              const isNumeric =
                typeof initialDetailSchema[
                  propertyKey as keyof DetailSchemaType
                ] === 'number'

              if (propertyKey === 'colorHex') {
                // 3. Get the latest colorHex value from the watched values
                const currentColorHex = watchedValues?.[index]?.colorHex || ''

                return (
                  <div key={propertyKey} className="flex flex-col gap-1">
                    <Label
                      htmlFor={fieldPath}
                      className="text-xs text-muted-foreground"
                    >
                      {labels?.[propertyKey] || propertyKey}
                      {isMandatory && <span className="text-rose-500">*</span>}
                    </Label>
                    <div className="flex items-center gap-x-2">
                      <ColorPicker
                        // 4. Use the reactive value here
                        value={currentColorHex}
                        onChange={(newHex) => {
                          setValue(fieldPath, newHex, { shouldValidate: true })
                          // Also update the color name field automatically
                          try {
                            const colorName = colorNamer(newHex).ntc[0].name
                            setValue(`${name}.${index}.color`, colorName)
                          } catch {
                            setValue(`${name}.${index}.color`, 'Custom Color')
                          }
                        }}
                      />
                    </div>
                  </div>
                )
              }
              // ... keep the rest of your rendering logic for other fields
              return (
                <div
                  key={propertyKey}
                  className="flex flex-col max-w-xs  gap-1 flex-grow"
                >
                  <Label
                    htmlFor={fieldPath}
                    className="text-xs text-muted-foreground"
                  >
                    {labels?.[propertyKey] || propertyKey}
                    {isMandatory && <span className="text-rose-500">*</span>}
                  </Label>
                  <Input
                    {...register(fieldPath as any, {
                      valueAsNumber: isNumeric,
                    })}
                    id={fieldPath}
                    type={isNumeric ? 'number' : 'text'}
                    className={cn('placeholder:capitalize', inputClassName)}
                    placeholder={labels?.[propertyKey] || propertyKey}
                    min={isNumeric ? 0 : undefined}
                    step={
                      isNumeric
                        ? propertyKey === 'price' ||
                          propertyKey === 'discount' ||
                          propertyKey === 'length' ||
                          propertyKey === 'width' ||
                          propertyKey === 'height' ||
                          propertyKey === 'weight'
                          ? '0.01'
                          : '1'
                        : undefined
                    }
                  />
                </div>
              )
            })}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveDetail(index)}
              className="text-destructive hover:bg-destructive/10"
            >
              <XCircle size={20} />
            </Button>
          </div>
        )
      })}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddDetail}
        className="mt-2 self-start"
      >
        <PlusCircle size={18} className="mr-2" /> {header || 'آیتم'}
      </Button>
    </div>
  )
}

export default ClickToAddInputsRHF
