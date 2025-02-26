#include <duckdb.h>


void duckffi_free(void *ptr);
void duckffi_dfree(void *ptr);
void duckffi_close(duckdb_database db);
void duckffi_free_blob(duckdb_blob* blob);
void duckffi_disconnect(duckdb_connection con);
void duckffi_free_result(duckdb_result* result);
void duckffi_free_ltype(duckdb_logical_type ltype);
void duckffi_free_prepare(duckdb_prepared_statement prepare);

duckdb_connection duckffi_connect(duckdb_database db);
duckdb_database duckffi_open(bool in_memory, const char* path);
duckdb_result* duckffi_query(duckdb_connection con, const char* query);
duckdb_result* duckffi_query_prepared(duckdb_prepared_statement prepare);
duckdb_prepared_statement duckffi_prepare(duckdb_connection con, const char* query);

void* duckffi_blob_data(duckdb_blob* blob);
uint32_t duckffi_blob_size(duckdb_blob* blob);
uint32_t duckffi_row_count(duckdb_result* result);
bool duckffi_row_count_large(duckdb_result* result);
uint32_t duckffi_enum_size(duckdb_logical_type type);
uint32_t duckffi_enum_type(duckdb_logical_type type);
uint32_t duckffi_column_count(duckdb_result* result);
uint64_t duckffi_row_count_slow(duckdb_result* result);
const char* duckffi_result_error(duckdb_result* result);
uint32_t duckffi_param_count(duckdb_prepared_statement prepare);
char* duckffi_enum_string(duckdb_logical_type type, uint32_t offset);
uint32_t duckffi_column_type(duckdb_result* result, uint32_t offset);
const char* duckffi_prepare_error(duckdb_prepared_statement prepare);
const char* duckffi_column_name(duckdb_result* result, uint32_t offset);
uint32_t duckffi_param_type(duckdb_prepared_statement prepare, uint32_t offset);
duckdb_logical_type duckffi_column_ltype(duckdb_result* result, uint32_t offset);

bool duckffi_bind_null(duckdb_prepared_statement prepare, uint32_t offset);
bool duckffi_bind_i8(duckdb_prepared_statement prepare, uint32_t offset, int8_t value);
bool duckffi_bind_f32(duckdb_prepared_statement prepare, uint32_t offset, float value);
bool duckffi_bind_u8(duckdb_prepared_statement prepare, uint32_t offset, uint8_t value);
bool duckffi_bind_f64(duckdb_prepared_statement prepare, uint32_t offset, double value);
bool duckffi_bind_i16(duckdb_prepared_statement prepare, uint32_t offset, int16_t value);
bool duckffi_bind_i32(duckdb_prepared_statement prepare, uint32_t offset, int32_t value);
bool duckffi_bind_i64(duckdb_prepared_statement prepare, uint32_t offset, int64_t value);
bool duckffi_bind_u16(duckdb_prepared_statement prepare, uint32_t offset, uint16_t value);
bool duckffi_bind_u32(duckdb_prepared_statement prepare, uint32_t offset, uint32_t value);
bool duckffi_bind_u64(duckdb_prepared_statement prepare, uint32_t offset, uint64_t value);
bool duckffi_bind_boolean(duckdb_prepared_statement prepare, uint32_t offset, bool value);
bool duckffi_bind_timestamp(duckdb_prepared_statement prepare, uint32_t offset, uint64_t value);
bool duckffi_bind_blob(duckdb_prepared_statement prepare, uint32_t offset, const void* value, uint32_t length);
bool duckffi_bind_string(duckdb_prepared_statement prepare, uint32_t offset, const char* value, uint32_t length);
bool duckffi_bind_interval(duckdb_prepared_statement prepare, uint32_t offset, uint32_t ms, uint32_t days, uint32_t months);

int8_t duckffi_value_i8(duckdb_result* result, uint32_t row, uint32_t column);
float duckffi_value_f32(duckdb_result* result, uint32_t row, uint32_t column);
uint8_t duckffi_value_u8(duckdb_result* result, uint32_t row, uint32_t column);
double duckffi_value_f64(duckdb_result* result, uint32_t row, uint32_t column);
int16_t duckffi_value_i16(duckdb_result* result, uint32_t row, uint32_t column);
int32_t duckffi_value_i32(duckdb_result* result, uint32_t row, uint32_t column);
int64_t duckffi_value_i64(duckdb_result* result, uint32_t row, uint32_t column);
uint16_t duckffi_value_u16(duckdb_result* result, uint32_t row, uint32_t column);
uint32_t duckffi_value_u32(duckdb_result* result, uint32_t row, uint32_t column);
uint64_t duckffi_value_u64(duckdb_result* result, uint32_t row, uint32_t column);
bool duckffi_value_boolean(duckdb_result* result, uint32_t row, uint32_t column);
bool duckffi_value_is_null(duckdb_result* result, uint32_t row, uint32_t column);
char* duckffi_value_string(duckdb_result* result, uint32_t row, uint32_t column);
uint32_t duckffi_value_date(duckdb_result* result, uint32_t row, uint32_t column);
uint32_t duckffi_value_time(duckdb_result* result, uint32_t row, uint32_t column);
duckdb_blob* duckffi_value_blob(duckdb_result* result, uint32_t row, uint32_t column);
uint64_t duckffi_value_timestamp_ms(duckdb_result* result, uint32_t row, uint32_t column);
uint32_t duckffi_value_interval_days(duckdb_result* result, uint32_t row, uint32_t column);
uint32_t duckffi_value_interval_months(duckdb_result* result, uint32_t row, uint32_t column);

int8_t duckffi_value_i8_slow(duckdb_result* result, uint64_t row, uint32_t column);
float duckffi_value_f32_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint8_t duckffi_value_u8_slow(duckdb_result* result, uint64_t row, uint32_t column);
double duckffi_value_f64_slow(duckdb_result* result, uint64_t row, uint32_t column);
int16_t duckffi_value_i16_slow(duckdb_result* result, uint64_t row, uint32_t column);
int32_t duckffi_value_i32_slow(duckdb_result* result, uint64_t row, uint32_t column);
int64_t duckffi_value_i64_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint16_t duckffi_value_u16_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint32_t duckffi_value_u32_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint64_t duckffi_value_u64_slow(duckdb_result* result, uint64_t row, uint32_t column);
bool duckffi_value_boolean_slow(duckdb_result* result, uint64_t row, uint32_t column);
bool duckffi_value_is_null_slow(duckdb_result* result, uint64_t row, uint32_t column);
char* duckffi_value_string_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint32_t duckffi_value_date_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint32_t duckffi_value_time_slow(duckdb_result* result, uint64_t row, uint32_t column);
duckdb_blob* duckffi_value_blob_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint64_t duckffi_value_timestamp_ms_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint32_t duckffi_value_interval_days_slow(duckdb_result* result, uint64_t row, uint32_t column);
uint32_t duckffi_value_interval_months_slow(duckdb_result* result, uint64_t row, uint32_t column);

uint8_t* duckffi_null_bitmap(duckdb_result* result, uint32_t rows, uint32_t column);