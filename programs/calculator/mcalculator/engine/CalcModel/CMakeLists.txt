cmake_minimum_required(VERSION 3.16.0)
project(CalcModel)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_library(CalcModel STATIC
    StandardModel.cpp
    Common/CalcDisplay.cpp
    Common/EngineResourceProv.cpp
)