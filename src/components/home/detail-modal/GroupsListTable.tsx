import {DEFAULT_OPTIONS, getTheme} from "@table-library/react-table-library/mantine";
import {useTheme} from "@table-library/react-table-library/theme";
import {CompactTable} from "@table-library/react-table-library/compact";
import * as TYPES from '@table-library/react-table-library/types/compact';
import {useSort} from "@table-library/react-table-library/sort";
import {
    IconArrowDown,
    IconArrowsSort,
    IconArrowUp,
    IconSort09,
    IconSortAscendingLetters,
    IconSortAscendingNumbers,
    IconSortAZ,
    IconSortDescendingLetters,
    IconSortDescendingNumbers
} from "@tabler/icons-react";

type ColumnData = { id: string, name: string, recipients: number | string }
type Props = {
    data: ColumnData[]
}

const tableKeys = {
    NAME: 'name',
    COUNT: 'recipients',
}

export default function GroupsListTable(props: Props) {
    const data = {nodes: props.data}

    const mantineTheme = getTheme({...DEFAULT_OPTIONS, verticalSpacing: 4});
    const theme = useTheme(mantineTheme);

    const sort = useSort(
            data,
            {},
            {
                sortIcon: {
                    iconDefault: <IconArrowsSort/>,
                    iconUp: <IconArrowUp/>,
                    iconDown: <IconArrowDown/>,
                    size: '1.15rem',
                },
                sortFns: {
                    [tableKeys.NAME]: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
                    [tableKeys.COUNT]: (array) => array.sort((a, b) => typeof a.recipients === 'number'
                            ? a.recipients - b.recipients
                            : a.recipients.localeCompare(b.recipients)
                    ),
                },
            },
    );

    const COLUMNS: TYPES.Column<ColumnData>[] = [
        {
            label: 'Группа',
            renderCell: (i: ColumnData) => i.name,
            resize: true,
            sort: {
                sortKey: tableKeys.NAME,
                sortIcon: {
                    iconDefault: <IconSortAZ/>,
                    iconUp: <IconSortAscendingLetters/>,
                    iconDown: <IconSortDescendingLetters/>,
                },
            },
        },
        {
            label: 'Кол-во получателей',
            renderCell: (i: ColumnData) => i.recipients,
            resize: true,
            sort: {
                sortKey: tableKeys.COUNT,
                sortIcon: {
                    iconDefault: <IconSort09/>,
                    iconUp: <IconSortAscendingNumbers/>,
                    iconDown: <IconSortDescendingNumbers/>,
                },
            },
        }
    ]

    return <CompactTable
            columns={COLUMNS}
            data={data}
            sort={sort}
            theme={theme}
    />
}
