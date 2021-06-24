class CalcManager {
    static registerCallbacks() {

        var _getCEngineStringCallback       = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:GetCEngineStringCallback");
        var _binaryOperatorReceivedCallback = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:BinaryOperatorReceivedCallback");
        var _setPrimaryDisplayCallback      = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:SetPrimaryDisplayCallback");
        var _setIsInErrorCallback           = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:SetIsInErrorCallback");
        var _setParenthesisNumberCallback   = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:SetParenthesisNumberCallback");
        var _maxDigitsReachedCallback       = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:MaxDigitsReachedCallback");
        var _memoryItemChangedCallback      = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:MemoryItemChangedCallback");
        var _onHistoryItemAddedCallback     = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:OnHistoryItemAddedCallback");
        var _onNoRightParenAddedCallback    = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:OnNoRightParenAddedCallback");
        var _setExpressionDisplayCallback   = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:SetExpressionDisplayCallback");
        var _setMemorizedNumbersCallback    = Module.mono_bind_static_method("[Calculator.Wasm] CalculationManager.NativeDispatch:SetMemorizedNumbersCallback");

        var fGetCEngineStringCallback       = addFunction((state, id) => _getCEngineStringCallback(state, id), 'iii');

        var fBinaryOperatorReceivedCallback = addFunction((state) => _binaryOperatorReceivedCallback(state), 'vi');
        var fSetPrimaryDisplayCallback      = addFunction((state, displayStringValue, isError) => _setPrimaryDisplayCallback(state, displayStringValue, isError), 'viii');
        var fSetIsInErrorCallback           = addFunction((state, isError) => _setIsInErrorCallback(state, isError), 'vii');
        var fSetParenthesisNumberCallback   = addFunction((state, parenthesisCount) => _setParenthesisNumberCallback(state, parenthesisCount), 'vii');
        var fMaxDigitsReachedCallback       = addFunction((state) => _maxDigitsReachedCallback(state), 'vii');
        var fMemoryItemChangedCallback      = addFunction((state, indexOfMemory) => _memoryItemChangedCallback(state, indexOfMemory), 'vii');
        var fOnHistoryItemAddedCallback     = addFunction((state, addedItemIndex) => _onHistoryItemAddedCallback(state, addedItemIndex), 'vii');
        var fOnNoRightParenAddedCallback    = addFunction((state) => _onNoRightParenAddedCallback(state), 'vi');
        var fSetExpressionDisplayCallback   = addFunction((state, historyItem) => _setExpressionDisplayCallback(state, historyItem), 'vii');
        var fSetMemorizedNumbersCallback    = addFunction((state, size, numbers) => _setMemorizedNumbersCallback(state, size, numbers), 'viii');

        var ret = `${fGetCEngineStringCallback};`
            + `${fBinaryOperatorReceivedCallback};`
            + `${fSetPrimaryDisplayCallback};`
            + `${fSetIsInErrorCallback};`
            + `${fSetParenthesisNumberCallback};`
            + `${fMaxDigitsReachedCallback};`
            + `${fMemoryItemChangedCallback};`
            + `${fOnHistoryItemAddedCallback};`
            + `${fOnNoRightParenAddedCallback};`
            + `${fSetExpressionDisplayCallback};`
            + `${fSetMemorizedNumbersCallback};`
            ;

        return ret;
    }
}
