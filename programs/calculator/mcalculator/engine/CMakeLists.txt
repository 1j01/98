cmake_minimum_required(VERSION 3.16.0)
project(engine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(CalcManager)
include_directories(CalcModel)
include_directories(./)

add_subdirectory(CalcManager)

add_subdirectory(CalcModel)

#add_executable(engine wrapper.cpp)
add_library(Engine STATIC wrapper.cpp)

target_link_libraries(Engine CalcManager CalcModel)
