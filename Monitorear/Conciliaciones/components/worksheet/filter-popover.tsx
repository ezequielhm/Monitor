import {
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverBody,
  PopoverTrigger,
  VStack,
  Flex,
  Portal,
} from "@chakra-ui/react";
import FilterIcon from "./filter-icon";
import { useState, useEffect } from 'react';
import { ColorIcon } from "@/components/worksheet/status-cells";
import { useStore } from "@/lib/store";

interface Status {
  id: string;
  color: string;
  descripcion: string;
}

interface ColumnFilter {
  id: string;
  value: any;
}

interface StatusItemProps {
  status: Status;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  isActive: boolean;
}

interface FilterPopoverProps {
  columnFilters: ColumnFilter[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
}

const StatusItem: React.FC<StatusItemProps> = ({ status, setColumnFilters, isActive }) => (
  <Flex
    align="center"
    cursor="pointer"
    fontWeight="bold"
    p={1.5}
    w={'100%'}
    bg={isActive ? status.color : "transparent"}
    _hover={{
      bg: status.color,
    }}
    onClick={() =>
      setColumnFilters((prev: ColumnFilter[]) => {
        const filter = prev.find((filter) => filter.id === "Estado");
        if (!filter) {
          return prev.concat({
            id: "Estado",
            value: [status.id],
          });
        }

        const newValues = isActive
          ? filter.value.filter((s: string) => s !== status.id)
          : filter.value.concat(status.id);

        if (newValues.length === 0) {
          return prev.filter((f) => f.id !== "Estado");
        }

        return prev.map((f) =>
          f.id === "Estado"
            ? {
                ...f,
                value: newValues,
              }
            : f
        );
      })
    }
  >
    <ColorIcon color={status.color} mr={3} />
    {status.descripcion}
  </Flex>
);

const FilterPopover: React.FC<FilterPopoverProps> = ({ columnFilters, setColumnFilters }) => {
  const [estados, setEstados] = useState<Status[]>([]);
  const { estadosApuntes, estadosMovimientos } = useStore(state => ({ estadosApuntes: state.estadosApuntes, estadosMovimientos: state.estadosMovimientos}));
  const filterStatuses = columnFilters.find((f) => f.id === "Estado")?.value || [];
  
  console.log('Estados Apuntes: ', estadosApuntes);

  console.log('Estados Movimientos: ', estadosMovimientos)
  
  useEffect(() => {
    const loadEstados = async () => {
      try {        
        // Combina los resultados
        setEstados([...estadosApuntes, ...estadosMovimientos]);
      } catch (error) {
        console.error('Failed to fetch estados', error);
      }
    };
    
    loadEstados();
  }, [estadosApuntes, estadosMovimientos]);

  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button
          size="sm"
          px={65}
          color={filterStatuses.length > 0 ? "#4d99bd" : ""}
          leftIcon={<Icon as={FilterIcon} fontSize={18} />}
        >
          Estado
        </Button>
      </PopoverTrigger>
      <Portal appendToParentPortal={false}>
        <PopoverContent bg={"white"} border={"2px solid black"} rounded={5} p={5} zIndex={10000}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <VStack align="flex-start" py={2} spacing={1}>
              {estados.map((status) => (
                <StatusItem
                  status={status}
                  isActive={filterStatuses.includes(status.id)}
                  setColumnFilters={setColumnFilters}
                  key={status.id}
                />
              ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default FilterPopover;
