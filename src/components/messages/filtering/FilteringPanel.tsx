"use client"

import {ActionIcon, Chip, ComboboxItem, ComboboxParsedItemGroup, Flex, MultiSelect, Stack} from "@mantine/core";
import {useFiltersStore} from "@/store/filters";
import {useParamsStore} from "@/store/params";
import {useGroupsStore} from "@/store/groups";
import {useEffect} from "react";
import {IconX} from "@tabler/icons-react";
import {SPECIALITY_NAMES_BY_CODE, SpecialityCodes} from "@/constants/speciality-names";

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
            <MultiSelect
                    placeholder={'Начните вводить направление'}
                    searchable
                    data={paramsStore.speciality.reduce((state: ComboboxParsedItemGroup[], item) => {
                        const groupName = SPECIALITY_NAMES_BY_CODE[item.split(" ")[0].split('.')[1] as SpecialityCodes]
                                || SPECIALITY_NAMES_BY_CODE['06']

                        if (!state.some(i => i.group == groupName)) {
                            state.push({group: groupName, items: []})
                        }

                        state.forEach(i => {
                            if (i.group == groupName) {
                                i.items.push(item as unknown as ComboboxItem)
                            }
                        })

                        return state
                    }, [])}
                    value={filtersStore.speciality}
                    onChange={filtersStore.setSpeciality}
                    clearable
            />
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
                {filtersStore.courses.length > 0 &&
                        <ActionIcon
                                variant="subtle"
                                radius={'lg'}
                                color={'black'}
                                onClick={() => filtersStore.setCourses([])}
                        >
                            <IconX stroke={1.5} size={'1em'}/>
                        </ActionIcon>}
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
                {filtersStore.formsOfEducation.length > 0 &&
                        <ActionIcon
                                variant="subtle"
                                radius={'lg'}
                                color={'black'}
                                onClick={() => filtersStore.setFormsOfEducation([])}
                        >
                            <IconX stroke={1.5} size={'1em'}/>
                        </ActionIcon>}
            </Flex>
        </Stack>
    </Stack>
}