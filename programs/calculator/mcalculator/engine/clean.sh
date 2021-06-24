#!/bin/bash
echo "cleaning build and generated Makefiles etc...."
rm ./CMakeCache.txt
rm -r ./CMakeFiles
rm ./Makefile
rm cmake_install.cmake
rm -r ./CalcManager/CMakeFiles
rm ./CalcManager/Makefile
rm ./CalcManager/cmake_install.cmake
rm ./CalcManager/libCalcManager.a
rm ./CalcModel/cmake_install.cmake
rm ./CalcModel/Makefile
rm ./CalcModel/libCalcModel.a
rm -r ./CalcModel/CMakeFiles
echo "done!"

