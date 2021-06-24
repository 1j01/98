#include "CalcModel/StandardModel.h"
#include <exception>
#include <iostream>

#include <emscripten.h>

StandardModel* ptr_smodel;

extern "C" {

EM_JS(void, init, (), {
    initialise(); 
});

EMSCRIPTEN_KEEPALIVE
void load() {
  static StandardModel smodel;
  ptr_smodel = &smodel;
}

EMSCRIPTEN_KEEPALIVE
void send(int COMMAND) {
  ptr_smodel->send(COMMAND);
}

EMSCRIPTEN_KEEPALIVE
void clearHs() {
  ptr_smodel->ClearHistory();
}
EMSCRIPTEN_KEEPALIVE
void clearMem() { 
  ptr_smodel->ClearAllMemory(); 
}
EMSCRIPTEN_KEEPALIVE
void memComm(int comm, int idx) {
  ptr_smodel->MemoryCommand(comm, idx); 
}

} //"C"

int main() {
     init(); //invoke javascript initialise()
}