import {useParamsStore} from "@/store/params";
import {useGroupsStore} from "@/store/groups";
import {useFiltersStore} from "@/store/filters";
import {useEffect} from "react";
import getUniqueValuesArray from "@/utils/getUniqueValuesArray";
import IGroup from "@/types/group";

export function useFilteringManager(groups: IGroup[], error?: any) {
    const paramsStore = useParamsStore()
    const setGroups = useGroupsStore(state => state.setGroups)
    const selectedGroups = useFiltersStore(state => state.selectedGroups)
    const setSelectedGroups = useFiltersStore(state => state.setSelectedGroups)

    useEffect(() => {
        if (groups && !error) {
            setGroups(groups)
            paramsStore.setCourses(getUniqueValuesArray<IGroup>(groups, 'course').toSorted().map(course => `${course} курс`))
            paramsStore.setFormsOfEducation(getUniqueValuesArray<IGroup>(groups, 'formOfEducation').toSorted())
            paramsStore.setSpeciality(getUniqueValuesArray<IGroup>(groups, 'speciality').toSorted())
        }
    }, [groups?.length, error]);

    const clearSelectedGroups = () => {
        setSelectedGroups([])
    }

    return {groups: selectedGroups, clear: clearSelectedGroups}
}