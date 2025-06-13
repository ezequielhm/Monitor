import { Button, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, VStack, Flex, Portal, PopoverHeader, Box } from "@chakra-ui/react";
import FilterIcon from "./filter-icon";
import { useState, useEffect } from 'react';
import { ColorIcon } from "@/components/worksheet/status-cells";
import { CheckCircleIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { Status } from "@/lib/definitions";
import { useStore } from "@/lib/store";

interface ColumnFilter {
  id: string;
  value: any;
}

interface StatusItemProps {
  status: Status;
  setActiveStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  isActive: boolean;
}

interface StatusFilterButtonProps {
  columnFilters: ColumnFilter[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  estados_?: Status[];
}

const StatusItem: React.FC<StatusItemProps> = ({ status, setActiveStatuses, isActive }) => (
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
    onClick={() => setActiveStatuses(prev => 
      isActive ? prev.filter(s => s !== status.id) : [...prev, status.id]
    )}
  >
    <ColorIcon color={status.color} mr={3} />
    {status.descripcion}
  </Flex>
);

const StatusFilterButton: React.FC<StatusFilterButtonProps> = ({ columnFilters, setColumnFilters, estados_ }) => {
  const estados:Status[] | undefined = estados_;
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadEstados = async () => {
      try {
        const filter = columnFilters.find(f => f.id === "Estado");
        if (filter) {
          setActiveStatuses(filter.value);
        }
      } catch (error) {
        console.error('Failed to fetch estados', error);
      }
    };

    loadEstados();
  }, [columnFilters]);

  const handleApplyFilter = () => {
    setColumnFilters(prev => {
      const newFilters = prev.filter(f => f.id !== "Estado");
      if (activeStatuses.length > 0) {
        return newFilters.concat({ id: "Estado", value: activeStatuses });
      }
      return newFilters;
    });
    setIsOpen(false);
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const isFilterApplied = activeStatuses.length > 0;

  return (
    <Popover isLazy isOpen={isOpen} onClose={handleClose}>
      <PopoverTrigger>
        <Button
          size="xs"
          variant="ghost"
          p={1}
          onClick={handleOpen}
        >
          <FilterIcon 
            width={18} 
            height={18} 
            stroke={isFilterApplied ? "#B0C4DE" : "currentColor"} 
            fill={isFilterApplied ? "#B0C4DE" : "none"} 
          />
        </Button>
      </PopoverTrigger>
      <Portal appendToParentPortal={false}>
        <PopoverContent bg={"white"} border={"1px solid black"} rounded={5} zIndex={10000}>
          <PopoverArrow />
          <PopoverHeader className="flex justify-center" p={0}>
            <Button onClick={handleClose} background="none" border="none">
              <CloseIcon />
            </Button>
          </PopoverHeader>
          <PopoverBody>
            <VStack align="flex-start" py={0} spacing={1}>
              {estados?.map((status) => (status.id !== '0' &&
                <StatusItem
                  status={status}
                  isActive={activeStatuses.includes(status.id)}
                  setActiveStatuses={setActiveStatuses}
                  key={status.id}
                />
              ))}
            </VStack>
            <Box className="flex w-full">
              <Box className="w-1/2 hover:text-green-500 text-center">
                <CheckCircleIcon onClick={handleApplyFilter}/>              
              </Box>
              <Box className='w-1/2 hover:text-red-500 text-center'>
                <DeleteIcon 
                onClick={() => {setColumnFilters(prev => prev.filter(f => f.id !== "Estado")); handleClose();}} />
              </Box>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default StatusFilterButton;
