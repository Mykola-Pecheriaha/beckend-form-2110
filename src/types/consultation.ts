export interface ConsultationFormData {
  name: string
  age?: number
  gender: string
  phone?: string
  height?: number
  weight?: number
  complaints?: string
  examinations: string[]
  hasChronicDiseases: boolean
  chronicDiseases?: string
  takesMedications: boolean
  medications?: string
  painLevel?: number | string // Може бути строкою з HTML input
  hasAllergy: boolean
  allergies?: string
  additionalNotes?: string
}

export interface ConsultationWithBMI {
  id: number
  createdAt: Date
  name: string
  age: number
  gender: string
  phone?: string | null
  height?: number | null
  weight?: number | null
  complaints?: string | null
  examinations?: string | null
  chronicDiseases?: string | null
  hasChronicDiseases: boolean
  medications?: string | null
  takesMedications: boolean
  painLevel?: number | null
  hasAllergy: boolean
  allergies?: string | null
  additionalNotes?: string | null
  bmi?: number
  bmiCategory?: string
}
