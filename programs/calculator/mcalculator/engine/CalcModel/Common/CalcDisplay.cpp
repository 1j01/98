#include "CalcDisplay.h"
#include "iostream"
#include <emscripten.h>

extern "C" {

EM_JS(void, setPr, (char* dStr), { 
    window.setPrimaryDisplay(UTF8ToString(dStr));
});
EM_JS(void, setEx, (char* eStr), {
    window.setExpressionDisplay(UTF8ToString(eStr));
});
EM_JS(void, setHs, (char* ex, char* res), {
    window.setHistoryItem(UTF8ToString(ex), UTF8ToString(res));
});
EM_JS(void, setMem, (char* mem), {
    window.setMemoryItem(UTF8ToString(mem));
});
EM_JS(void, upMem, (char* mem, int idx), {
    window.updateMemoryItem(UTF8ToString(mem), idx);
})


}

CalcDisplay::CalcDisplay() {
  nMemItems = 0;
}

void CalcDisplay::SetStdCallback(
  CalculationManager::CalculatorManager* standardCalculatorManagerPtr) {
  m_standardCalculatorManagerPtr = standardCalculatorManagerPtr;
}

void CalcDisplay::SetPrimaryDisplay(const std::wstring &pszText, bool isError)
{
    char* str = new char[255];
    sprintf(str, "%ls", pszText.c_str());
    setPr(str);
}
void CalcDisplay::SetIsInError(bool isInError)
{
    //Nothing for now
}
void CalcDisplay::SetExpressionDisplay(
    _Inout_ std::shared_ptr<std::vector<std::pair<std::wstring, int>>> const &tokens,
    _Inout_ std::shared_ptr<std::vector<std::shared_ptr<IExpressionCommand>>> const &commands)
{
  auto ntokens = tokens->size();
  std::wstring exDisplay;
  for (auto i = 0; i < ntokens; ++i) {
    auto currentToken = (*tokens)[i];
    auto currentTokenString = currentToken.first;
    exDisplay += currentTokenString;
  }
  char* str = new char[255];
  sprintf(str, "%ls", exDisplay.c_str());
  setEx(str);
}
void CalcDisplay::SetParenthesisNumber(_In_ unsigned int count)
{
    //std::wcout << "<<SetParenthesis not implemented yet>>" << std::endl;
}
void CalcDisplay::OnNoRightParenAdded()
{
    std::wcout << "<<OnRightParenAdded not implemented yet>>" << std::endl;
}
void CalcDisplay::MaxDigitsReached()
{
    //do nothong
} // not an error but still need to inform UI layer.
void CalcDisplay::BinaryOperatorReceived()
{
    //Do Nothing
}
void CalcDisplay::OnHistoryItemAdded(_In_ unsigned int addedItemIndex)
{
  auto hItemV = m_standardCalculatorManagerPtr->GetHistoryItem(addedItemIndex)->historyItemVector;
  auto expression = hItemV.expression;
  auto result = hItemV.result;
  expression = expression.substr(1, expression.length() - 2);
  char* ex = new char[255];
  char* res = new char[255];
  sprintf(ex, "%ls", expression.c_str());
  sprintf(res, "%ls", result.c_str());
  setHs(ex, res);
}
void CalcDisplay::SetMemorizedNumbers(const std::vector<std::wstring> &memorizedNumbers)
{
  m_memorizedNumbers = memorizedNumbers;
  auto len = memorizedNumbers.size();
  auto num = memorizedNumbers[0];
  char* str = new char[255];
  sprintf(str, "%ls", num.c_str());
  if(len > nMemItems) {
    setMem(str);
  }
  nMemItems = len;
}
void CalcDisplay::MemoryItemChanged(unsigned int indexOfMemory)
{
  auto mem = m_memorizedNumbers[indexOfMemory];
  char* str = new char[255];
  sprintf(str, "%ls", mem.c_str());
  upMem(str, indexOfMemory);
}
void CalcDisplay::InputChanged()
{
    //yes i sent that
}