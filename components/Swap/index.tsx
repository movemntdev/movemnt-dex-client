import React from 'react';

import {VStack, Text, IconButton, Button, Box} from "@chakra-ui/react";

import { MdOutlineSwapVert } from "react-icons/md";

import Card from "@/components/Utilities/Card";
import CoinInput from "@/components/Utilities/CoinInput";

import useSwap from "@/hooks/useSwap";
import SlippageToleranceModal from "@/components/Swap/SlippageToleranceModal";
import coins from "@/data/coins";

const Swap = () => {

    const {
        inputCoin,
        updateInputCoin,
        inputAmount,
        updateInputAmount,
        outputCoin,
        updateOutputCoin,
        outputAmount,
        updateOutputAmount,
        slippageTolerance,
        updateSlippageTolerance,
        swapCoins,
        onSwap,
        disabled,
        swapExists
    } = useSwap();

    return (
        <Card>
            <VStack
                spacing={4}
            >
                <Box
                    w='100%'
                    position='relative'
                >
                    <Text
                        fontSize='2xl'
                        fontWeight='bold'
                        w='100%'
                        textAlign={'center'}
                    >
                        Swap
                    </Text>
                    <Box
                        position='absolute'
                        right={0}
                        top={0}
                    >
                        <SlippageToleranceModal
                            slippageTolerance={slippageTolerance}
                            setSlippageTolerance={updateSlippageTolerance}
                        />
                    </Box>
                </Box>

                <CoinInput
                    label="From"
                    amount={inputAmount}
                    setAmount={updateInputAmount}
                    coin={inputCoin}
                    setCoin={updateInputCoin}
                    coins={coins.filter(coin => coin.symbol !== outputCoin?.symbol)}
                    isBalanceMax
                />
                <IconButton
                    aria-label='SwapCoins'
                    icon={<MdOutlineSwapVert />}
                    onClick={swapCoins}
                />
                <CoinInput
                    label="To"
                    amount={outputAmount}
                    setAmount={updateOutputAmount}
                    coin={outputCoin}
                    setCoin={updateOutputCoin}
                    coins={coins.filter(coin => coin.symbol !== inputCoin?.symbol)}
                />
                <Button
                    onClick={onSwap}
                    w='100%'
                    isDisabled={disabled}
                >
                    Swap
                </Button>
                {
                    (inputCoin && outputCoin && !swapExists) && (
                        <Text
                            color='red.500'
                            fontSize='sm'
                        >
                            Pool does not exist
                        </Text>
                    )
                }
            </VStack>
        </Card>
    );
};

export default Swap;
