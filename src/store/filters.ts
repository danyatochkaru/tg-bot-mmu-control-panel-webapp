import {create} from "zustand";
import {persist} from "zustand/middleware"
import Group from "@/types/group";

export type FiltersStoreParams = {
    groups: Group[],
    setGroups: (groups: Group[]) => void,
    selectedGroups: Group["groupOid"][],
    setSelectedGroups: (selectedGroups: Group["groupOid"][]) => void,
    isFiltering: boolean,
    toggleIsFiltering: (isFiltering?: boolean) => void
    courses: string[],
    setCourses: (courses: string[]) => void,
    formsOfEducation: string[],
    setFormsOfEducation: (formsOfEducation: string[]) => void,
    speciality: string[],
    setSpeciality: (speciality: string[]) => void,
}

export const useFiltersStore = create<FiltersStoreParams>()(persist((set) => ({
    groups: [],
    selectedGroups: [],
    courses: [],
    formsOfEducation: [],
    speciality: [],
    isFiltering: false,
    setSelectedGroups: (selectedGroups) => set({selectedGroups}),
    toggleIsFiltering: (isFiltering) => set(state => ({isFiltering: isFiltering ?? !state.isFiltering})),
    setGroups: (groups: Group[]) => set({groups}),
    setCourses: (courses: string[]) => set({courses}),
    setFormsOfEducation: (formsOfEducation: string[]) => set({formsOfEducation}),
    setSpeciality: (speciality: string[]) => set({speciality}),
}), {name: 'filters-store'}))