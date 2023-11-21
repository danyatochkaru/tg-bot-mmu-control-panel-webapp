"use client"

import {AppShell, Button, Container, Divider, Flex, Group, Text} from "@mantine/core";
import {FilteringPanel, FilteringResultList} from "@/components";
import useFetcher from "@/hooks/useFetcher";
import IGroup from "@/types/group";
import {useEffect} from "react";
import {useParamsStore} from "@/store/params";
import getUniqueValuesArray from "@/utils/getUniqueValuesArray";
import {useGroupsStore} from "@/store/groups";
import {useFiltersStore} from "@/store/filters";
import endingByNum from "@/utils/endingByNum";

export default function FilteringPage() {
    const {data, error} = useFetcher<IGroup>('/dictionary/groups')

    const paramsStore = useParamsStore()
    const setGroups = useGroupsStore(state => state.setGroups)
    const selectedGroups = useFiltersStore(state => state.selectedGroups)
    const setSelectedGroups = useFiltersStore(state => state.setSelectedGroups)

    useEffect(() => {
        if (data && !error) {
            setGroups(data)
            paramsStore.setCourses(getUniqueValuesArray<IGroup>(data, 'course').toSorted().map(course => `${course} курс`))
            paramsStore.setFormsOfEducation(getUniqueValuesArray<IGroup>(data, 'formOfEducation').toSorted())
            paramsStore.setSpeciality(getUniqueValuesArray<IGroup>(data, 'speciality').toSorted())
        }
    }, [data?.length, !!error]);

    return <>
        <Container p={'md'}>
            <FilteringPanel/>
            <Divider my="sm" label={'Группы'}/>
            <FilteringResultList/>
        </Container>
        <AppShell.Footer>
            <Container>
                <Flex h={50} justify={'space-between'} align={'center'}>
                    <Group align={'center'}>
                        <Text size={'sm'}>Выбрано {selectedGroups.length} {endingByNum(selectedGroups.length, ['группа', 'группы', 'групп'])}</Text>
                        <Button variant={'outline'} color={'red'} size={'compact-sm'}
                                onClick={() => setSelectedGroups([])}
                                disabled={!selectedGroups.length}
                        >Очистить</Button>
                    </Group>
                    <Button title={'В разработке'} disabled={!selectedGroups.length || true}>Далее</Button>
                </Flex>
            </Container>
        </AppShell.Footer>
    </>
}