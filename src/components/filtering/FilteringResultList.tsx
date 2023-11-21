"use client"

import {Button, Chip, Flex, Text} from "@mantine/core";
import {useFiltersStore} from "@/store/filters";
import {useGroupsStore} from "@/store/groups";

export function FilteringResultList() {
    const filtersStore = useFiltersStore()
    const groups = useGroupsStore(state => state.groups)

    const GroupChip = ({name, groupOid}: any) => <Chip
            variant={'outline'}
            checked={filtersStore.selectedGroups.some(v => v === groupOid)}
            onChange={() => {
                filtersStore.setSelectedGroups(
                        filtersStore.selectedGroups.some(v => v === groupOid)
                                ? filtersStore.selectedGroups.filter(v => groupOid !== v)
                                : [...filtersStore.selectedGroups, groupOid]
                )
            }}>{name}</Chip>

    return (
            <Flex wrap={'wrap'} gap={'xs'}>
                {filtersStore.isFiltering
                        &&
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
                }
                {
                    filtersStore.isFiltering ? (filtersStore.groups.length > 0
                                    ? filtersStore.groups.map(i => <GroupChip key={i.groupOid} name={i.name}
                                                                              groupOid={i.groupOid}/>)
                                    : <Text size={'sm'}>Подходящих под параметры фильтрации групп не найдено</Text>
                    ) : filtersStore.selectedGroups.length > 0
                            ? <>
                                <Text>Выбранные группы: </Text>
                                {groups
                                        .filter(g => filtersStore.selectedGroups.includes(g.groupOid))
                                        .map(i => <GroupChip key={i.groupOid} name={i.name} groupOid={i.groupOid}/>)}
                            </>
                            : <Text size={'sm'}>Для отображения списка групп начните заполнять поля фильтрации</Text>
                }
            </Flex>
    );
}