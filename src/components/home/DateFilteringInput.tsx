import {Checkbox, Stack} from "@mantine/core";
import {DatePickerInput, DatesRangeValue, DateValue} from "@mantine/dates";
import {IconX} from "@tabler/icons-react";
import dayjs from "dayjs";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useToggle} from "@mantine/hooks";

export function DateFilteringInput() {
    const sp = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [isRange, toggleIsRange] = useToggle()

    const handleDateChange = (value: DateValue | DatesRangeValue | null) => {
        const params = new URLSearchParams(sp.toString())

        params.delete(`filter-date`)

        if (Array.isArray(value)) {
            value[0] && params.append('filter-date', dayjs(value[0]).format('MM.DD.YYYY'))
            value[1] && params.append('filter-date', dayjs(value[1]).format('MM.DD.YYYY'))
        }
        if (value instanceof Date) {
            params.set(`filter-date`, dayjs(value).format('MM.DD.YYYY'))
        }

        router.push(pathname + "?" + params.toString())
    }

    return <Stack gap={'xs'}>
        <DatePickerInput label={`Дата`}
                         valueFormat={'DD MMMM YYYY'}
                         type={(sp.getAll('filter-date').length > 1 || isRange) ? 'range' : 'default'}
                         rightSection={
                                 sp.has('filter-date') && <IconX size={'1em'}
                                                                 style={{cursor: 'pointer'}}
                                                                 onClick={() => handleDateChange(isRange ? [null, null] : null)}/>
                         }
                         value={sp.has('filter-date')
                                 ? (sp.getAll('filter-date').length > 1 || isRange)
                                         ? [
                                             sp.getAll('filter-date')[0]
                                                     ? dayjs(sp.getAll('filter-date')[0]).toDate()
                                                     : dayjs(sp.get('filter-date')).toDate(),
                                             sp.getAll('filter-date')[1]
                                                     ? dayjs(sp.getAll('filter-date')[1]).toDate()
                                                     : null
                                         ]
                                         : dayjs(sp.get('filter-date')).toDate()
                                 : (sp.getAll('filter-date').length > 1 || isRange) ? [null, null] : null}
                         placeholder={`Выберите ${(sp.getAll('filter-date').length > 1 || isRange) ? 'диапозон дат' : 'дату'}`}
                         onChange={value => {
                             if (Array.isArray(value) && value.every(i => i === null)) {
                                 return
                             }
                             handleDateChange(value)
                         }}
        />
        <Checkbox label={'Диапозон дат'}
                  checked={sp.getAll('filter-date').length > 1 || isRange}
                  onChange={() => toggleIsRange()}
        />
    </Stack>
}