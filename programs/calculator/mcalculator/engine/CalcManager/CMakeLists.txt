cmake_minimum_required(VERSION 3.16.0)
project (CalcManager)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_library(CalcManager STATIC
    #pch.cpp
    ExpressionCommand.cpp
    CEngine/calc.cpp
    CEngine/CalcUtils.cpp
    CEngine/History.cpp
    CEngine/scicomm.cpp
    CEngine/scidisp.cpp
    CEngine/scifunc.cpp
    CEngine/scioper.cpp
    CEngine/sciset.cpp
    Ratpack/basex.cpp
    Ratpack/conv.cpp
    Ratpack/exp.cpp
    Ratpack/fact.cpp
    Ratpack/itrans.cpp
    Ratpack/itransh.cpp
    Ratpack/logic.cpp
    Ratpack/num.cpp
    Ratpack/rat.cpp
    Ratpack/support.cpp
    Ratpack/trans.cpp
    Ratpack/transh.cpp
    CalculatorHistory.cpp
    CalculatorManager.cpp
    UnitConverter.cpp
    CEngine/CalcInput.cpp
    CEngine/Number.cpp
    CEngine/Rational.cpp
    CEngine/RationalMath.cpp
    NumberFormattingUtils.cpp
)

#target_precompile_headers(CalcManager PUBLIC pch.h)