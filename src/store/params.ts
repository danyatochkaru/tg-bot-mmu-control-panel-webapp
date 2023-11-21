import {create} from "zustand";
import {persist} from "zustand/middleware";

type ParamsStoreParams = {
    courses: string[],
    formsOfEducation: string[],
    speciality: string[],
    setCourses: (courses: string[]) => void,
    setFormsOfEducation: (formsOfEducation: string[]) => void,
    setSpeciality: (speciality: string[]) => void
}

export const useParamsStore = create<ParamsStoreParams>()(persist((set) => ({
    courses: [],
    formsOfEducation: [],
    speciality: [],
    setCourses: (courses: string[]) => set({courses}),
    setFormsOfEducation: (formsOfEducation: string[]) => set({formsOfEducation}),
    setSpeciality: (speciality: string[]) => set({speciality}),
}), {name: 'params-store'}))