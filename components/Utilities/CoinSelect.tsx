import React from 'react';

import {Button, Menu, MenuButton, MenuItem, MenuList, Image} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";

import {Coin} from "@/types/Coin";

interface Props {
    coin: Coin | null;
    setCoin: (coin: Coin) => void;
    coins: Coin[];
}

const CoinSelect: React.FC<Props> = ({ coin, setCoin, coins }) => {

    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                leftIcon={
                    coin ? (
                        <Image
                            boxSize={6}
                            alt={coin.name}
                            src={coin.imageURL}
                            rounded='full'
                        />
                    ) : undefined
                }
                w={80}
            >
                {coin ? coin.symbol : 'Select Coin'}
            </MenuButton>
            <MenuList>
                {
                    coins.map(coin => (
                        <MenuItem
                            key={coin.name}
                            onClick={() => setCoin(coin)}
                            icon={
                                <Image
                                    boxSize={6}
                                    alt={coin.name}
                                    src={coin.imageURL}
                                    rounded='full'
                                />
                            }
                        >
                            {coin.symbol}
                        </MenuItem>
                    ))
                }
            </MenuList>
        </Menu>
    );
};

export default CoinSelect;
