'use client'

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Portal
} from '@chakra-ui/react';

import { Column } from '@tanstack/react-table';
import { DeleteIcon } from '@chakra-ui/icons';
import { Filter } from './filters';
import FilterIcon from './filter-icon';
import StatusFilterButton from './filter-buttton-status';
import { Status } from '@/lib/definitions';

interface FilterButtonProps {
  column: Column<any, any>;
  columnFilters: Filter[];
  setColumnFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  estados_?: Status[];
}

const FilterButton: React.FC<FilterButtonProps> = ({
  column,
  columnFilters,
  setColumnFilters,
  estados_,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const filterValue = columnFilters.find((f) => f.id === column.id)?.value || '';

  useEffect(() => {
    setInputValue(filterValue);
  }, [filterValue]);

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleApplyFilter = () => {
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== column.id).concat({ id: column.id, value: inputValue })
    );
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyFilter();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      initialFocusRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);
  const isFilterApplied = Boolean(filterValue);

  if (column.id === 'Estado') {
    return (
      <StatusFilterButton
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        estados_={estados_}
      />
    );
  }

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      initialFocusRef={initialFocusRef}
      onClose={handleClose}
      closeOnBlur={true}>
      <PopoverTrigger>
        <Button
          size="xs"
          variant="ghost"
          p={1}
          onClick={handleOpen}
          position="relative"
          zIndex={1}
        >
          <FilterIcon
            width={18}
            height={18}
            stroke={isFilterApplied ? '#B0C4DE' : 'currentColor'}
            fill={isFilterApplied ? '#B0C4DE' : 'none'}
          />
        </Button>
      </PopoverTrigger>
      <Portal appendToParentPortal={false}>
      <PopoverContent
        bg="white"
        border="1px solid #ccc"
        rounded="md"
        p={0}
        zIndex={9999}
        boxShadow="xl"
        width="250px"
        style={{
          position: 'absolute',
          pointerEvents: 'auto',
        }}
      >
        <PopoverArrow />
        <PopoverBody
          p={0}
          display="flex"
          alignItems="center"
        >
          <Input
            ref={initialFocusRef}
            type="text"
            variant="outline"
            placeholder="Buscar"
            value={inputValue}
            onChange={onFilterChange}
            onKeyDown={handleKeyDown}
            height="36px"
            borderRadius="md"
            border="1px solid #ccc"
            flex={1}
          />
          <Box
            px={2}
            cursor="pointer"
            onClick={() => {
              setInputValue('');
              setColumnFilters((prev) => prev.filter((f) => f.id !== column.id));
              handleClose();
            }}
            _hover={{ color: 'red.500' }}
          >
            <DeleteIcon />
          </Box>
        </PopoverBody>
      </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default FilterButton;
