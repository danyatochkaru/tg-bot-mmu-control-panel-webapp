"use client"

import {Button, Chip, Group, SimpleGrid, Skeleton, Stack, Text} from "@mantine/core";
import {useFiltersStore} from "@/store/filters";
import {useGroupsStore} from "@/store/groups";
import {useEffect, useState} from "react";

export function FilteringResultList() {
    const filtersStore = useFiltersStore()
    const groups = useGroupsStore(state => state.groups)
    const [init, setInit] = useState(false)

    useEffect(() => {
        setInit(true)
    }, []);

    const GroupChip = ({name, groupOid}: any) => <Chip
            width={'fit-content'}
            variant={'outline'}
            checked={filtersStore.selectedGroups.some(v => v === groupOid)}
            onChange={() => {
                filtersStore.setSelectedGroups(
                        filtersStore.selectedGroups.some(v => v === groupOid)
                                ? filtersStore.selectedGroups.filter(v => groupOid !== v)
                                : [...filtersStore.selectedGroups, groupOid]
                )
            }}>{name}</Chip>

    if (!init) {
        const groupsPlaceholder = Array(34).fill('GroupName')
        return <SimpleGrid cols={{base: 2, xs: 4, sm: 5, md: 6}}>
            {groupsPlaceholder.map((i, index) => (
                    <Skeleton key={index} w={'fit-content'}><Chip variant={'outline'}>{i}</Chip></Skeleton>))}
        </SimpleGrid>
    }

    return (
            <Stack>
                {filtersStore.isFiltering && filtersStore.groups.length > 0
                        &&
                        <Group>
                            <Button

                                    size={'compact-sm'}
                                    variant={'filled'}
                                    radius={'lg'}
                                    onClick={() => {
                                        const groupsOids = filtersStore.groups.map(g => g.groupOid)
                                        filtersStore.groups.some(g => !filtersStore.selectedGroups.includes(g.groupOid))
                                                ? filtersStore.setSelectedGroups
                                                ([
                                                            ...filtersStore.selectedGroups,
                                                            ...groupsOids.filter(g => !filtersStore.selectedGroups.includes(g))
                                                        ]
                                                )
                                                : filtersStore.setSelectedGroups(filtersStore.selectedGroups.filter(value => !groupsOids.includes(value)))
                                    }}
                            >
                                {
                                    filtersStore.groups.some(g => !filtersStore.selectedGroups.includes(g.groupOid))
                                            ? "Выбрать все группы из списка"
                                            : "Снять выделение с групп из списка"
                                }
                            </Button>
                        </Group>
                }
                {
                    filtersStore.isFiltering
                            ? filtersStore.groups.length == 0 &&
                            <Text size={'sm'}>Подходящих под параметры фильтрации групп не найдено</Text>
                            : filtersStore.selectedGroups.length > 0
                                    ? <Text>Выбранные группы: </Text>
                                    : <Text size={'sm'}>Для отображения списка групп начните заполнять поля фильтрации</Text>
                }
                <SimpleGrid cols={{base: 2, xs: 4, sm: 5, md: 6}}>
                    {
                        filtersStore.isFiltering
                                ? filtersStore.groups.map(i => <GroupChip key={i.groupOid}
                                                                          name={i.name}
                                                                          groupOid={i.groupOid}/>)
                                : filtersStore.selectedGroups.length > 0 && groups
                                .filter(g => filtersStore.selectedGroups.includes(g.groupOid))
                                .map(i => <GroupChip key={i.groupOid} name={i.name}
                                                     groupOid={i.groupOid}/>)
                    }
                </SimpleGrid>
            </Stack>
    );
}