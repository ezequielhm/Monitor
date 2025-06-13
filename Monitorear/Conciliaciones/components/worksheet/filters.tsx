import {
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import FilterPopover from "./filter-popover";

// Define the type for a filter
export interface Filter {
  id: string;
  value: string;
}

// Define the props for the Filters component
interface FiltersProps {
  columnFilters: Filter[];
  setColumnFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}

const Filters: React.FC<FiltersProps> = ({ columnFilters, setColumnFilters }) => {
  const Importe = columnFilters.find((f: Filter) => f.id === "Importe")?.value || "";
  const Desc = columnFilters.find((f: Filter) => f.id === "Desc")?.value || "";
  const Comentario = columnFilters.find((f: Filter) => f.id === "Comentario")?.value || "";

  const onFilterChange = (id: string, value: string) =>
    setColumnFilters((prev: Filter[]) =>
      prev
        .filter((f: Filter) => f.id !== id)
        .concat({
          id,
          value,
        })
    );
    return (
      <HStack className='flex justify-center' mb={4} spacing={15}>
        <InputGroup size="xs" maxW="8rem">
          <Input
            type="text"
            variant="outline"
            placeholder="Importe"
            borderRadius={3}
            value={Importe}
            onChange={(e) => onFilterChange("Importe", e.target.value)}
            p={1}
            w={130}
          />
        </InputGroup>
        <InputGroup size="xs" maxW="8rem">
          <Input
            type="text"
            variant="outline"
            placeholder="Descripción"
            borderRadius={3}
            value={Desc}
            onChange={(e) => onFilterChange("Desc", e.target.value)}
            p={1}
            w={130}
          />
        </InputGroup>
        <InputGroup size="xs" maxW="8rem">
          <Input
            type="text"
            variant="outline"
            placeholder="Comentario"
            borderRadius={3}
            value={Comentario}
            onChange={(e) => onFilterChange("Comentario", e.target.value)}
            p={1}
            w={130}
            />
        </InputGroup>
        <FilterPopover
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </HStack>
    );
  };
  export default Filters;
