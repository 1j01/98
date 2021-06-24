#include "CalcManager/CalculatorManager.h"
#include "Common/CalcDisplay.h"
#include "Common/EngineResourceProv.h"

class StandardModel
{
private:
    /* data */
public:
    StandardModel(/* args */);
    CalcDisplay m_calcDisplay;
    EngineResourceProv m_engineResourceProv;
    CalculationManager::CalculatorManager m_standardCalculatorManager;
    void send(int COMMAND);
    void ClearHistory();
    void ClearAllMemory();
    void MemoryCommand(int command, int index);
};