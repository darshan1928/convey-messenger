import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import React from 'react'

export default function UserBadgeItem({user,handleFunction}) {
    return (
        <Box
            px={2}
            py={1}
            borderRadius={"lg"}
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"
            onClick={handleFunction}
            borderWidth="5px"
            backgroundColor="purple"
            color="white"
        >
            {user.name}
            <CloseIcon pl={1} />
        </Box>
    );
}
