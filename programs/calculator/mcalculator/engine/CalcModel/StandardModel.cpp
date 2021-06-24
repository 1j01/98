#include <iostream>
#include "StandardModel.h"
#include "CalcManager/Command.h"
using namespace CalculationManager;

StandardModel::StandardModel()
    : m_standardCalculatorManager(&m_calcDisplay, &m_engineResourceProv)
{
    m_standardCalculatorManager.SetStandardMode();
    m_calcDisplay.SetStdCallback(&m_standardCalculatorManager);
}
void StandardModel::send(int intCOMMAND)
{
    auto COMMAND = static_cast<Command>(intCOMMAND);
    if (COMMAND == Command::CommandMPLUS || COMMAND == Command::CommandMMINUS ||
        COMMAND == Command::CommandSTORE || COMMAND == Command::CommandRECALL ||
        COMMAND == Command::CommandMCLEAR) {
      switch (COMMAND) {
        case Command::CommandMPLUS:
          m_standardCalculatorManager.MemorizedNumberAdd(0);
          break;
        case Command::CommandMMINUS:
          m_standardCalculatorManager.MemorizedNumberSubtract(0);
          break;
        case Command::CommandSTORE:
          m_standardCalculatorManager.MemorizeNumber();
        case Command::CommandRECALL:
          m_standardCalculatorManager.MemorizedNumberLoad(0);
          break;
        default:
          m_standardCalculatorManager.MemorizedNumberClear(0);
      }
    } else
      m_standardCalculatorManager.SendCommand(COMMAND);
}
void StandardModel::MemoryCommand(int comm, int idx) {
  /*
  'mp': 1
  'mm': 2
  'mc': 3
  */
  if (comm == 1)
    m_standardCalculatorManager.MemorizedNumberAdd(idx);
  else if(comm == 2)
    m_standardCalculatorManager.MemorizedNumberSubtract(idx);
  else if (comm == 3)
    m_standardCalculatorManager.MemorizedNumberClear(idx);
}
void StandardModel::ClearHistory() { 
    m_standardCalculatorManager.ClearHistory(); 
}
void StandardModel::ClearAllMemory() {
    m_standardCalculatorManager.MemorizedNumberClearAll(); 
}
