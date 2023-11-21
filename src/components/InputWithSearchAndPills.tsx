import {useState} from 'react';
import {CheckIcon, Combobox, Group, Pill, PillsInput, useCombobox} from '@mantine/core';

export function InputWithSearchAndPills({dataset, selected: value, setSelected: setValue}: {
    dataset: string[],
    selected: string[],
    setSelected: (fn: (current: string[]) => string[]) => void
}) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');
    // const [value, setValue] = useState<string[]>([]);

    const handleValueSelect = (val: string) =>
            setValue((current: string[]) =>
                    current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
            );

    const handleValueRemove = (val: string) =>
            setValue((current: string[]) => current.filter((v) => v !== val));

    const values = value.map((item) => (
            <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
                {item}
            </Pill>
    ));

    const options = dataset
            .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
            .map((item) => (
                    <Combobox.Option value={item} key={item} active={value.includes(item)}>
                        <Group gap="sm">
                            {value.includes(item) ? <CheckIcon size={12}/> : null}
                            <span>{item}</span>
                        </Group>
                    </Combobox.Option>
            ));

    return (
            <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
                <Combobox.DropdownTarget>
                    <PillsInput onClick={() => combobox.openDropdown()}>
                        <Pill.Group>
                            {values}

                            <Combobox.EventsTarget>
                                <PillsInput.Field
                                        onFocus={() => combobox.openDropdown()}
                                        onBlur={() => combobox.closeDropdown()}
                                        value={search}
                                        placeholder="Введите направление"
                                        onChange={(event) => {
                                            combobox.updateSelectedOptionIndex();
                                            setSearch(event.currentTarget.value);
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Backspace' && search.length === 0) {
                                                event.preventDefault();
                                                handleValueRemove(value[value.length - 1]);
                                            }
                                        }}
                                />
                            </Combobox.EventsTarget>
                        </Pill.Group>
                    </PillsInput>
                </Combobox.DropdownTarget>

                <Combobox.Dropdown>
                    <Combobox.Options mah={200} style={{overflowY: 'auto'}}>
                        {options.length > 0 ? options : <Combobox.Empty>Ничего не найдено...</Combobox.Empty>}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
    );
}
