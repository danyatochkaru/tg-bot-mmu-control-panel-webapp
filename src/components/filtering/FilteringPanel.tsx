import {Chip, Flex, Stack} from "@mantine/core";
import {InputWithSearchAndPills} from "@/components";
import {useFiltersStore} from "@/store/filters";
import {useParamsStore} from "@/store/params";
import {useGroupsStore} from "@/store/groups";
import {useEffect} from "react";

export function FilteringPanel() {
    const filtersStore = useFiltersStore()
    const paramsStore = useParamsStore()
    const groups = useGroupsStore(state => state.groups)

    type PickFilteringStore = keyof Pick<typeof filtersStore, "formsOfEducation" | "courses" | "speciality">

    const compareWithFormData = (path: PickFilteringStore, value: string) => filtersStore[path].includes(value)

    useEffect(() => {
        if (filtersStore.courses.length > 0 || filtersStore.formsOfEducation.length > 0 || filtersStore.speciality.length > 0) {
            filtersStore.toggleIsFiltering(true)
            filtersStore.setGroups(groups
                    .filter(g => filtersStore.speciality && filtersStore.speciality.length > 0 ? filtersStore.speciality.includes(g.speciality) : true)
                    .filter(g => filtersStore.courses && filtersStore.courses.length > 0 ? filtersStore.courses.includes(`${g.course} курс`) : true)
                    .filter(g => filtersStore.formsOfEducation && filtersStore.formsOfEducation.length > 0 ? filtersStore.formsOfEducation.includes(g.formOfEducation) : true)
            )
        } else {
            filtersStore.toggleIsFiltering(false)
        }
    }, [filtersStore.courses, filtersStore.formsOfEducation, filtersStore.speciality]);

    return <Stack gap={'sm'}>
        <Stack>
            <InputWithSearchAndPills dataset={paramsStore.speciality} selected={filtersStore.speciality}
                                     setSelected={(update) => {
                                         const updated = update(filtersStore.speciality)
                                         filtersStore.setSpeciality(updated)
                                     }}/>
        </Stack>
        <Stack gap={'xs'}>
            <Flex gap={'xs'} wrap={'wrap'}>
                {paramsStore.courses.map((value, index) => (<Chip
                        key={index}
                        variant="outline"
                        checked={compareWithFormData('courses', value)}
                        onChange={() => filtersStore.setCourses(
                                compareWithFormData('courses', value)
                                        ? filtersStore.courses.filter(item => item !== value)
                                        : [...filtersStore.courses, value]
                        )}
                >{value}</Chip>))}
            </Flex>
        </Stack>
        <Stack gap={'xs'}>
            <Flex gap={'xs'} wrap={'wrap'}>
                {paramsStore.formsOfEducation.map((value, index) => (<Chip
                        key={index}
                        variant="outline"
                        checked={compareWithFormData('formsOfEducation', value)}
                        onChange={() => filtersStore.setFormsOfEducation(
                                compareWithFormData('formsOfEducation', value)
                                        ? filtersStore.formsOfEducation.filter(item => item !== value)
                                        : [...filtersStore.formsOfEducation, value]
                        )}
                >{value}</Chip>))}
            </Flex>
        </Stack>
    </Stack>
}