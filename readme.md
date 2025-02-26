clang src/sql.c -O3 -shared -o bin/libduckdb.dll -lduckdb -L"C:\projects\deno-duckdb-master\bin" -I"C:\projects\deno-duckdb-master\include"

clang src/sql.c -O3 -shared -o bin/duckdb.dll -lduckdb -L"C:\projects\deno-duckdb-mas
ter\bin" -I"C:\projects\deno-duckdb-master\include" -v

clang src/sql.c -O3 -shared -o bin/libduckdb.dll -lduckdb -L"C:\projects\deno-duckdb-master\bin" -I"C:\projects\deno-duckdb-master\include" -Wl,--out-implib,bin/libduckdb.lib