#include "CalcManager/CalculatorResource.h"
#include "string"
#include "unordered_map"

class EngineResourceProv : public CalculationManager::IResourceProvider {
public:
  EngineResourceProv();
  virtual std::wstring GetCEngineString(std::wstring_view id) override;
    
  std::unordered_map<std::wstring, std::wstring> m_resources;
};