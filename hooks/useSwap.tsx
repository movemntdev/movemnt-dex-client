import { useState, useMemo } from "react";

import useSubmitTransaction from "@/hooks/utils/useSubmitTransaction";

import {getInputAmount, getOutputAmount} from "@/services/dexSwapCalculations";

import {Coin} from "@/types/Coin";
import {buildSwapPayload} from "@/services/dexPayloadBuilder";
import {CurveType} from "@/types/CurveType";
import {useAptos} from "@/contexts/AptosContext";
import {isSwapExists} from "@/services/dexUtils";

const useSwap = () => {

    const { client } = useAptos();

    const { submitTransaction } = useSubmitTransaction();

    const [inputCoin, setInputCoin] = useState<Coin | null>(null);
    const [outputCoin, setOutputCoin] = useState<Coin | null>(null);
    const [inputAmount, setInputAmount] = useState<number>(0);
    const [outputAmount, setOutputAmount] = useState<number>(0);
    const [slippageTolerance, setSlippageTolerance] = useState<number>(0.01);
    const [swapExists, setSwapExists] = useState<boolean>(false);

    const disabled = useMemo(() => (
        !inputCoin || !outputCoin || inputAmount <= 0 || outputAmount <= 0 || !swapExists
    ), [inputAmount, inputCoin, outputAmount, outputCoin, swapExists]);

    const curveType = useMemo<CurveType>(() => "Uncorrelated", []);

    const fetchOutputAmount = async (uiInputAmount: number, inputCoin: Coin | null, outputCoin: Coin | null) => {
        if(!inputCoin || !outputCoin || uiInputAmount <= 0) return;
        const calculatedOutputAmount = await getOutputAmount(
            client,
            uiInputAmount,
            inputCoin,
            outputCoin,
            curveType
        );
        if(calculatedOutputAmount > 0) setOutputAmount(calculatedOutputAmount);
    }

    const fetchInputAmount = async (uiOutputAmount: number, inputCoin: Coin | null, outputCoin: Coin | null) => {
        if(!inputCoin || !outputCoin || uiOutputAmount <= 0) return;
        const calculatedInputAmount = await getInputAmount(
            client,
            uiOutputAmount,
            inputCoin,
            outputCoin,
            curveType
        );
        if(calculatedInputAmount > 0) setInputAmount(calculatedInputAmount);
    }

    const fetchSwapExists = async (inputCoin: Coin | null, outputCoin: Coin | null) => {
        if(!inputCoin || !outputCoin) return;
        const swapExists = await isSwapExists(client, inputCoin, outputCoin, "Uncorrelated");
        setSwapExists(swapExists);
    }

    const updateInputCoin = async (coin: Coin) => {
        setInputCoin(coin)
        await Promise.all([
            fetchSwapExists(coin, outputCoin),
            fetchOutputAmount(inputAmount, coin, outputCoin),
        ])
    }

    const updateInputAmount = async (amount: number) => {
        setInputAmount(amount);
        await fetchOutputAmount(amount, inputCoin, outputCoin);
    }

    const updateOutputCoin = async (coin: Coin) => {
        setOutputCoin(coin);
        await Promise.all([
            fetchSwapExists(inputCoin, coin),
            fetchInputAmount(outputAmount, inputCoin, coin),
        ])
    }

    const updateOutputAmount = async (amount: number) => {
        setOutputAmount(amount);
        await fetchInputAmount(amount, inputCoin, outputCoin);
    }

    const updateSlippageTolerance = async (tolerance: number) => {
        setSlippageTolerance(tolerance);
    }

    const swapCoins = async () => {
        const tempCoin = inputCoin;
        setInputCoin(outputCoin);
        setOutputCoin(tempCoin);
        const tempAmount = inputAmount;
        setInputAmount(outputAmount);
        setOutputAmount(tempAmount);
    }

    const onSwap = async () => {
        if(!inputCoin || !outputCoin) return;
        const swapPayload = buildSwapPayload(
            inputCoin,
            outputCoin,
            curveType,
            inputAmount * 10 ** inputCoin.decimals,
            (outputAmount * 10 ** outputCoin.decimals) * (1 - slippageTolerance),
        );
        const success = await submitTransaction(swapPayload, {
            title: "Swap Succeeded",
            description: `Swapped ${inputAmount} ${inputCoin?.symbol} for ${outputAmount} ${outputCoin?.symbol}`
        })
        if(success) {
            setInputAmount(0);
            setOutputAmount(0);
        }
    }

    return {
        inputCoin,
        outputCoin,
        inputAmount,
        outputAmount,
        slippageTolerance,
        updateInputCoin,
        updateInputAmount,
        updateOutputCoin,
        updateOutputAmount,
        updateSlippageTolerance,
        swapCoins,
        onSwap,
        swapExists,
        disabled
    }
}

export default useSwap;