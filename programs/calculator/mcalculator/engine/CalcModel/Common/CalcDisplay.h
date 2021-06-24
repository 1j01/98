#include "CalcManager/CalculatorManager.h"
#include "CalcManager/Header Files/ICalcDisplay.h"

class CalcDisplay : public ICalcDisplay
{
public:
    CalcDisplay();
    void SetStdCallback(CalculationManager::CalculatorManager* standardCalculatorManagerPtr);
    CalculationManager::CalculatorManager* m_standardCalculatorManagerPtr;

  private:
    void SetPrimaryDisplay(const std::wstring &pszText, bool isError);
    void SetIsInError(bool isInError);
    void SetExpressionDisplay(
        _Inout_ std::shared_ptr<std::vector<std::pair<std::wstring, int>>> const &tokens,
        _Inout_ std::shared_ptr<std::vector<std::shared_ptr<IExpressionCommand>>> const &commands);
    void SetParenthesisNumber(_In_ unsigned int count);
    void OnNoRightParenAdded();
    void MaxDigitsReached(); // not an error but still need to inform UI layer.
    void BinaryOperatorReceived();
    void OnHistoryItemAdded(_In_ unsigned int addedItemIndex);
    void SetMemorizedNumbers(const std::vector<std::wstring> &memorizedNumbers);
    void MemoryItemChanged(unsigned int indexOfMemory);
    void InputChanged();
    int nMemItems;
    std::vector<std::wstring> m_memorizedNumbers;
    // float m_callbackReference;
    // float m_historyCallbackReference;
};
