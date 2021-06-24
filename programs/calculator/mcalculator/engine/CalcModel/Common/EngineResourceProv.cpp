// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include <iostream>
#include "EngineResourceProv.h"
#include <string>
using namespace std;

EngineResourceProv::EngineResourceProv()
{
  m_resources.reserve(250);
  //multiply and divide symbols dont seem to work normally
  m_resources = {{L"sDecimal", L"."}, {L"11", L"/"}, {L"12", L"*"}, {L"13", L"+"}, {L"14", L"-"},
    {L"2", L"CE"}, {L"30", L"√"}, {L"31", L"sqr"}, {L"38", L"%"}, {L"41", L"="}, {L"4", L"."},
    {L"48", L"("}, {L"49", L")"}, {L"66", L"frac"}, {L"88", L"e^"}, {L"90", L"√"}, {L"91", L"sqr"},
    {L"92", L"cube"}, {L"94", L"fact"}, {L"95", L"1/"}, {L"97", L"negate"},
    {L"99", L"Cannot divide by zero"}, {L"100", L"Invalid input"}, {L"101", L"Result is undefined"},
    {L"105", L"Not enough memory"}, {L"107", L"Overflow"}, {L"108", L"Result not defined"},
    {L"118", L"Result not defined"}, {L"119", L"Overflow"}, {L"120", L"Overflow"},
    {L"99", L"Cannot divide by zero"}};
}

wstring EngineResourceProv::GetCEngineString(wstring_view id)
{

    if (id.compare(L"sDecimal") == 0)
    {
        return L"."; //TODO return location based . or ,
    }

    if (id.compare(L"sThousand") == 0)
    {
        return L","; //Grouping NotYetImplemented
    }

    if (id.compare(L"sGrouping") == 0) //NotYetImplemented
    {
        // The following groupings are the onces that CalcEngine supports.
        //   0;0             0x000          - no grouping
        //   3;0             0x003          - group every 3 digits
        //   3;2;0           0x023          - group 1st 3 and then every 2 digits
        //   4;0             0x004          - group every 4 digits
        //   5;3;2;0         0x235          - group 5, then 3, then every 2
        return L"NotImplemented";
    }
    return m_resources[id.data()];
}
