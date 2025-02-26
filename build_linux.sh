#!/bin/bash

clang src/sql.c \
-O3 -flto \
-shared \
-mtune=native \
-o ./bin/libduckdb.so \
-lduckdb -L"./lib" -I"./include" -v