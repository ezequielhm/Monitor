import { Icon } from '@chakra-ui/react';

interface SortIconProps {
  isSorted: boolean | 'asc' | 'desc';
  isSortedDesc: boolean;
  onClick?: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

const SortIcon: React.FC<SortIconProps> = ({ isSorted, isSortedDesc, onClick }) => {
  return (
    <Icon viewBox="0 0 24 24" width="1.3em" height="1.3em" onClick={onClick} cursor="pointer" marginBottom={'0.1em'}>
      {isSorted ? (
        isSortedDesc ? (
          <path d="M3 6h18v2H3V6zm0 7h14v2H3v-2zm0 7h10v2H3v-2z" fill="currentColor" />
        ) : (
          <path d="M3 18h18v-2H3v2zm0-7h14v-2H3v2zm0-7h10V2H3v2z" fill="currentColor" />
        )
      ) : (
        <path d="M3 6h18v2H3V6zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" fill="currentColor" />
      )}
    </Icon>
  );
};

export default SortIcon;
