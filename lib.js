import { exists } from "jsr:@std/fs@0.213.1/exists";
import { dlopen } from "jsr:@divy/plug@1.0.3";

function ptr(v) {
  return Deno.UnsafePointer.of(v);
}
function toArrayBuffer(v, start, offset) {
  const view = new Deno.UnsafePointerView(v);
  return view.getArrayBuffer(start, offset);
}
function getCString(v) {
  const view = new Deno.UnsafePointerView(v);
  return view.getCString();
}

const utf8e = new TextEncoder();
const GeneratorFunction = function* () {}.constructor;

const devMode = Deno.env.get("DENO_DUCKDB_DEV");
const duckdbLib = Deno.env.get("DENO_DUCKDB_LIB");
const execpath = devMode ? import.meta.url : `file:///${Deno.cwd()}/`;
const path = {
  linux() {
    return new URL(`./bin/libduckdb.so`, execpath);
  },
  darwin() {
    return new URL(`./bin/libduckdb.dylib`, execpath);
  },
  windows() {
    return new URL(`./bin/libduckdb.dll`, execpath);
  },
}[Deno.build.os]();

const { symbols: duck } = Deno.dlopen(duckdbLib ?? path, {
  duckffi_free: { parameters: ["pointer"], result: "void" },
  duckffi_dfree: { parameters: ["pointer"], result: "void" },
  duckffi_close: { parameters: ["pointer"], result: "void" },
  duckffi_connect: { parameters: ["pointer"], result: "pointer" },
  duckffi_row_count: { parameters: ["pointer"], result: "u32" },
  duckffi_enum_size: { parameters: ["pointer"], result: "u32" },
  duckffi_enum_type: { parameters: ["pointer"], result: "u32" },
  duckffi_blob_size: { parameters: ["pointer"], result: "u32" },
  duckffi_blob_data: { parameters: ["pointer"], result: "pointer" },
  duckffi_free_blob: { parameters: ["pointer"], result: "void" },
  duckffi_free_ltype: { parameters: ["pointer"], result: "void" },
  duckffi_disconnect: { parameters: ["pointer"], result: "void" },
  duckffi_param_count: { parameters: ["pointer"], result: "u32" },
  duckffi_open: { parameters: ["u8", "pointer"], result: "pointer" },
  duckffi_query: { parameters: ["pointer", "pointer"], result: "pointer" },
  duckffi_free_result: { parameters: ["pointer"], result: "void" },
  duckffi_column_count: { parameters: ["pointer"], result: "u32" },
  duckffi_result_error: { parameters: ["pointer"], result: "pointer" },
  duckffi_free_prepare: { parameters: ["pointer"], result: "void" },
  duckffi_prepare_error: { parameters: ["pointer"], result: "pointer" },
  duckffi_prepare: { parameters: ["pointer", "pointer"], result: "pointer" },
  duckffi_row_count_slow: { parameters: ["pointer"], result: "u64" },
  duckffi_query_prepared: { parameters: ["pointer"], result: "pointer" },
  duckffi_row_count_large: { parameters: ["pointer"], result: "u8" },
  duckffi_param_type: { parameters: ["pointer", "u32"], result: "u32" },
  duckffi_enum_string: { parameters: ["pointer", "u32"], result: "pointer" },
  duckffi_column_name: { parameters: ["pointer", "u32"], result: "pointer" },
  duckffi_column_type: { parameters: ["pointer", "u32"], result: "u32" },
  duckffi_column_ltype: { parameters: ["pointer", "u32"], result: "pointer" },
  duckffi_null_bitmap: {
    parameters: ["pointer", "u32", "u32"],
    result: "pointer",
  },

  duckffi_bind_null: { parameters: ["pointer", "u32"], result: "u8" },
  duckffi_bind_u8: { parameters: ["pointer", "u32", "u8"], result: "u8" },
  duckffi_bind_i8: { parameters: ["pointer", "u32", "i8"], result: "u8" },
  duckffi_bind_u16: { parameters: ["pointer", "u32", "u16"], result: "u8" },
  duckffi_bind_i16: { parameters: ["pointer", "u32", "i16"], result: "u8" },
  duckffi_bind_u32: { parameters: ["pointer", "u32", "u32"], result: "u8" },
  duckffi_bind_i32: { parameters: ["pointer", "u32", "i32"], result: "u8" },
  duckffi_bind_f32: { parameters: ["pointer", "u32", "f32"], result: "u8" },
  duckffi_bind_u64: { parameters: ["pointer", "u32", "u64"], result: "u8" },
  duckffi_bind_i64: { parameters: ["pointer", "u32", "i64"], result: "u8" },
  duckffi_bind_f64: { parameters: ["pointer", "u32", "f64"], result: "u8" },
  duckffi_bind_blob: {
    parameters: ["pointer", "u32", "pointer", "u32"],
    result: "u8",
  },
  duckffi_bind_string: {
    parameters: ["pointer", "u32", "pointer", "u32"],
    result: "u8",
  },
  duckffi_bind_timestamp: {
    parameters: ["pointer", "u32", "u64"],
    result: "u8",
  },
  duckffi_bind_interval: {
    parameters: ["pointer", "u32", "u32", "u32", "u32"],
    result: "u8",
  },

  duckffi_value_u8: { parameters: ["pointer", "u32", "u32"], result: "u8" },
  duckffi_value_i8: { parameters: ["pointer", "u32", "u32"], result: "i8" },
  duckffi_value_u16: { parameters: ["pointer", "u32", "u32"], result: "u16" },
  duckffi_value_i16: { parameters: ["pointer", "u32", "u32"], result: "i16" },
  duckffi_value_u32: { parameters: ["pointer", "u32", "u32"], result: "u32" },
  duckffi_value_i32: { parameters: ["pointer", "u32", "u32"], result: "i32" },
  duckffi_value_f32: { parameters: ["pointer", "u32", "u32"], result: "f32" },
  duckffi_value_u64: { parameters: ["pointer", "u32", "u32"], result: "u64" },
  duckffi_value_i64: { parameters: ["pointer", "u32", "u32"], result: "i32" },
  duckffi_value_f64: { parameters: ["pointer", "u32", "u32"], result: "f64" },
  duckffi_value_time: {
    parameters: ["pointer", "u32", "u32"],
    result: "u32",
  },
  duckffi_value_date: {
    parameters: ["pointer", "u32", "u32"],
    result: "u32",
  },
  duckffi_value_blob: {
    parameters: ["pointer", "u32", "u32"],
    result: "pointer",
  },
  duckffi_value_string: {
    parameters: ["pointer", "u32", "u32"],
    result: "pointer",
  },
  duckffi_value_boolean: {
    parameters: ["pointer", "u32", "u32"],
    result: "u8",
  },
  duckffi_value_is_null: {
    parameters: ["pointer", "u32", "u32"],
    result: "u8",
  },
  duckffi_value_interval_days: {
    parameters: ["pointer", "u32", "u32"],
    result: "u32",
  },
  duckffi_value_interval_months: {
    parameters: ["pointer", "u32", "u32"],
    result: "u32",
  },
  duckffi_value_timestamp_ms: {
    parameters: ["pointer", "u32", "u32"],
    result: "u64",
  },

  duckffi_value_u8_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u8",
  },
  duckffi_value_i8_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "i8",
  },
  duckffi_value_u16_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u16",
  },
  duckffi_value_i16_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "i16",
  },
  duckffi_value_u32_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u32",
  },
  duckffi_value_i32_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "i32",
  },
  duckffi_value_f32_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "f32",
  },
  duckffi_value_u64_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u64",
  },
  duckffi_value_i64_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "i64",
  },
  duckffi_value_f64_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "f64",
  },
  duckffi_value_time_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u32",
  },
  duckffi_value_date_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u32",
  },
  duckffi_value_blob_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "pointer",
  },
  duckffi_value_string_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "pointer",
  },
  duckffi_value_boolean_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u8",
  },
  duckffi_value_is_null_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u8",
  },
  duckffi_value_interval_days_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u32",
  },
  duckffi_value_interval_months_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u32",
  },
  duckffi_value_timestamp_ms_slow: {
    parameters: ["pointer", "u64", "u32"],
    result: "u64",
  },
});

for (const k in duck) duck[k] = duck[k].native || duck[k];

export function close(db) {
  duck.duckffi_close(db);
}

export function disconnect(c) {
  duck.duckffi_disconnect(c);
}

function bitmap_get(buf, offset) {
  return (buf[(offset / 8) | 0] >> offset % 8) & 1;
}

export function connect(db) {
  const c = duck.duckffi_connect(db);
  if (0 === c) throw new Error("duckdb: failed to connect to database");
  return c;
}

const TRUE = 1;
const FALSE = 0;

export function open(path) {
  const db =
    path === null
      ? duck.duckffi_open(TRUE, 0)
      : duck.duckffi_open(FALSE, ptr(utf8e.encode(path + "\0")));

  if (0 === db) throw new Error("duckdb: failed to open database");
  return db;
}

const _t = {
  invalid: 0,
  boolean: 1,
  tinyint: 2,
  smallint: 3,
  integer: 4,
  bigint: 5,
  utinyint: 6,
  usmallint: 7,
  uinteger: 8,
  ubigint: 9,
  float: 10,
  double: 11,
  timestamp: 12,
  date: 13,
  time: 14,
  interval: 15,
  hugeint: 16,
  varchar: 17,
  blob: 18,
  decimal: 19,
  timestamp_s: 20,
  timestamp_ms: 21,
  timestamp_ns: 22,
  enum: 23,
  list: 24,
  struct: 25,
  map: 26,
  uuid: 27,
  json: 28,
};

const _tr = Object.fromEntries(Object.entries(_t).map(([k, v]) => [v, k]));
const blob_gc = new FinalizationRegistry((ptr) => duck.duckffi_free_blob(ptr));
const ltype_gc = new FinalizationRegistry((ptr) =>
  duck.duckffi_free_ltype(ptr)
);
const result_gc = new FinalizationRegistry((ptr) =>
  duck.duckffi_free_result(ptr)
);
const prepare_gc = new FinalizationRegistry((ptr) =>
  duck.duckffi_free_prepare(ptr)
);

const _tm = {
  [_t.time](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_time(r, row, column);
  },
  [_t.float](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_f32(r, row, column);
  },
  [_t.double](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_f64(r, row, column);
  },
  [_t.bigint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_i64(r, row, column);
  },
  [_t.tinyint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_i8(r, row, column);
  },
  [_t.ubigint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_u64(r, row, column);
  },
  [_t.integer](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_i32(r, row, column);
  },
  [_t.utinyint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_u8(r, row, column);
  },
  [_t.smallint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_i16(r, row, column);
  },
  [_t.uinteger](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_u32(r, row, column);
  },
  [_t.usmallint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_u16(r, row, column);
  },
  [_t.boolean](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_boolean(r, row, column);
  },
  [_t.timestamp](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_timestamp_ms(r, row, column);
  },
  [_t.varchar](r, _ltypes, _column) {
    return (row, column) =>
      getCString(duck.duckffi_value_string(r, row, column));
  },
  [_t.date](r, _ltypes, _column) {
    return (row, column) =>
      24 * 60 * 60 * 1000 * duck.duckffi_value_date(r, row, column);
  },

  [_t.blob](r, _ltypes, _column) {
    return (row, column) => {
      const blob = duck.duckffi_value_blob(r, row, column);
      const ab = toArrayBuffer(
        duck.duckffi_blob_data(blob),
        0,
        duck.duckffi_blob_size(blob)
      );

      return blob_gc.register(ab, blob), new Uint8Array(ab);
    };
  },

  [_t.interval](r, _ltypes, _column) {
    return (row, column) => {
      const ms = duck.duckffi_value_interval_days(r, row, column);

      const days = (ms / (24 * 60 * 60 * 1000)) | 0;

      return {
        days: days,
        ms: ms - days * (24 * 60 * 60 * 1000),
        months: duck.duckffi_value_interval_months(r, row, column),
      };
    };
  },

  [_t.enum](r, ltypes, _column) {
    const ltype = (ltypes[_column] = duck.duckffi_column_ltype(r, _column));

    const names = new Array(duck.duckffi_enum_size(ltype));
    const tf = _tm[duck.duckffi_enum_type(ltype)](r, ltypes, _column);

    return (row, column) => {
      const offset = tf(row, column);

      let name = names[offset];

      if (name === undefined) {
        const s = duck.duckffi_enum_string(ltype, offset);
        name = names[offset] = getCString(s);
        duck.duckffi_dfree(s);
      }

      return name;
    };
  },
};

const _tms = {
  [_t.time](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_time_slow(r, row, column);
  },
  [_t.float](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_f32_slow(r, row, column);
  },
  [_t.double](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_f64_slow(r, row, column);
  },
  [_t.bigint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_i64_slow(r, row, column);
  },
  [_t.tinyint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_i8_slow(r, row, column);
  },
  [_t.ubigint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_u64_slow(r, row, column);
  },
  [_t.integer](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_i32_slow(r, row, column);
  },
  [_t.utinyint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_u8_slow(r, row, column);
  },
  [_t.smallint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_i16_slow(r, row, column);
  },
  [_t.uinteger](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_u32_slow(r, row, column);
  },
  [_t.usmallint](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_u16_slow(r, row, column);
  },
  [_t.boolean](r, _ltypes, _column) {
    return (row, column) => duck.duckffi_value_boolean_slow(r, row, column);
  },
  [_t.timestamp](r, _ltypes, _column) {
    return (row, column) =>
      duck.duckffi_value_timestamp_ms_slow(r, row, column);
  },
  [_t.varchar](r, _ltypes, _column) {
    return (row, column) =>
      getCString(duck.duckffi_value_string_slow(r, row, column));
  },
  [_t.date](r, _ltypes, _column) {
    return (row, column) =>
      24 * 60 * 60 * 1000 * duck.duckffi_value_date_slow(r, row, column);
  },

  [_t.blob](r, _ltypes, _column) {
    return (row, column) => {
      const blob = duck.duckffi_value_blob_slow(r, row, column);
      const ab = toArrayBuffer(
        duck.duckffi_blob_data(blob),
        0,
        duck.duckffi_blob_size(blob)
      );

      return blob_gc.register(ab, blob), new Uint8Array(ab);
    };
  },

  [_t.interval](r, _ltypes, _column) {
    return (row, column) => {
      const ms = duck.duckffi_value_interval_days_slow(r, row, column);

      const days = (ms / (24 * 60 * 60 * 1000)) | 0;

      return {
        days: days,
        ms: ms - days * (24 * 60 * 60 * 1000),
        months: duck.duckffi_value_interval_months_slow(r, row, column),
      };
    };
  },

  [_t.enum](r, ltypes, _column) {
    const ltype = (ltypes[_column] = duck.duckffi_column_ltype(r, _column));

    const names = new Array(duck.duckffi_enum_size(ltype));
    const tf = _tms[duck.duckffi_enum_type(ltype)](r, ltypes, _column);

    return (row, column) => {
      const offset = tf(row, column);

      let name = names[offset];

      if (name === undefined) {
        const s = duck.duckffi_enum_string(ltype, offset);
        name = names[offset] = getCString(s);
        duck.duckffi_dfree(s);
      }

      return name;
    };
  },
};

export function query(c, query) {
  const r = duck.duckffi_query(c, ptr(utf8e.encode(query + "\0")));

  {
    const e = duck.duckffi_result_error(r);

    if (e) {
      const s = getCString(e);
      throw (duck.duckffi_free_result(r), new Error(s));
    }
  }

  const rows = duck.duckffi_row_count(r);
  const columns = duck.duckffi_column_count(r);
  if (0 === rows) return duck.duckffi_free_result(r), [];

  const a = new Array(rows);
  const nulls = new Array(columns);
  const names = new Array(columns);
  const types = new Array(columns);
  const nullsv = new Array(columns);
  const ltypes = new Array(columns);

  for (let offset = 0; offset < columns; offset++) {
    nulls[offset] = duck.duckffi_null_bitmap(r, rows, offset);
    names[offset] = getCString(duck.duckffi_column_name(r, offset));
    types[offset] = _tm[duck.duckffi_column_type(r, offset)](r, ltypes, offset);
    nullsv[offset] = new Uint8Array(
      toArrayBuffer(nulls[offset], 0, Math.ceil(rows / 8))
    );
  }

  try {
    for (let offset = 0; rows > offset; offset++) {
      const row = (a[offset] = {});

      for (let column = 0; column < columns; column++) {
        if (bitmap_get(nullsv[column], offset)) {
          row[names[column]] = null;
        } else {
          row[names[column]] = types[column](offset, column);
        }
      }
    }

    return a;
  } finally {
    const len = ltypes.length;

    for (let offset = 0; offset < columns; offset++) {
      duck.duckffi_free(nulls[offset]);
    }

    for (let offset = 0; len > offset; offset++) {
      const x = ltypes[offset];
      if (x) duck.duckffi_free_ltype(x);
    }

    duck.duckffi_free_result(r);
  }
}

export function* stream(c, query) {
  const r = duck.duckffi_query(c, ptr(utf8e.encode(query + "\0")));

  {
    const e = duck.duckffi_result_error(r);

    if (e) {
      const s = getCString(e);
      throw (duck.duckffi_free_result(r), new Error(s));
    }
  }

  const t = {};
  result_gc.register(t, r, t);
  const slow = duck.duckffi_row_count_large(r);
  const columns = duck.duckffi_column_count(r);

  const names = new Array(columns);
  const types = new Array(columns);
  const ltypes = new Array(columns);

  for (let offset = 0; offset < columns; offset++) {
    names[offset] = getCString(duck.duckffi_column_name(r, offset));
    types[offset] = (!slow ? _tm : _tms)[duck.duckffi_column_type(r, offset)](
      r,
      ltypes,
      offset
    );
  }

  const len = ltypes.length;

  for (let offset = 0; len > offset; offset++) {
    const ltype = ltypes[offset];
    if (ltype) ltype_gc.register(t, ltype, t);
  }

  if (!slow) {
    const rows = duck.duckffi_row_count(r);

    for (let offset = 0; rows > offset; offset++) {
      const row = {};

      for (let column = 0; column < columns; column++) {
        if (duck.duckffi_value_is_null(r, offset, column)) {
          row[names[column]] = null;
        } else {
          row[names[column]] = types[column](offset, column);
        }
      }

      yield row;
    }
  } else {
    const rows = duck.duckffi_row_count_slow(r);

    for (let offset = 0n; rows > offset; offset++) {
      const row = {};

      for (let column = 0; column < columns; column++) {
        if (duck.duckffi_value_is_null_slow(r, offset, column)) {
          row[names[column]] = null;
        } else {
          row[names[column]] = types[column](offset, column);
        }
      }

      yield row;
    }
  }

  for (let offset = 0; len > offset; offset++) {
    const x = ltypes[offset];
    if (x) duck.duckffi_free_ltype(x);
  }

  ltype_gc.unregister(t);
  result_gc.unregister(t);
  duck.duckffi_free_result(r);
}

const _trm = {
  [_t.enum](n, offset) {
    return _trm[_t.varchar](n, offset);
  },
  [_t.time](n, offset) {
    return `if (type === 'string') { ${_trm[_t.varchar](
      n,
      offset
    )} } else { ${_trm[_t.timestamp](n, offset)} }`;
  },
  [_t.date](n, offset) {
    return `if (type === 'string') { ${_trm[_t.varchar](
      n,
      offset
    )} } else { ${_trm[_t.timestamp](n, offset)} }`;
  },
  [_t.float](n, offset) {
    return `if (duck.duckffi_bind_f32(p, ${offset}, ${n})) throw new Error('failed to bind float at ${offset}');`;
  },
  [_t.bigint](n, offset) {
    return `if (duck.duckffi_bind_i64(p, ${offset}, ${n})) throw new Error('failed to bind bigint at ${offset}');`;
  },
  [_t.double](n, offset) {
    return `if (duck.duckffi_bind_f64(p, ${offset}, ${n})) throw new Error('failed to bind double at ${offset}');`;
  },
  [_t.ubigint](n, offset) {
    return `if (duck.duckffi_bind_u64(p, ${offset}, ${n})) throw new Error('failed to bind ubigint at ${offset}');`;
  },
  [_t.boolean](n, offset) {
    return `if (duck.duckffi_bind_bool(p, ${offset}, ${n})) throw new Error('failed to bind boolean at ${offset}');`;
  },
  [_t.tinyint](n, offset) {
    return `if (duck.duckffi_bind_i8(p, ${offset}, ${n} | 0)) throw new Error('failed to bind tinyint at ${offset}');`;
  },
  [_t.integer](n, offset) {
    return `if (duck.duckffi_bind_i32(p, ${offset}, ${n} | 0)) throw new Error('failed to bind integer at ${offset}');`;
  },
  [_t.utinyint](n, offset) {
    return `if (duck.duckffi_bind_u8(p, ${offset}, ${n} | 0)) throw new Error('failed to bind utinyint at ${offset}');`;
  },
  [_t.smallint](n, offset) {
    return `if (duck.duckffi_bind_i16(p, ${offset}, ${n} | 0)) throw new Error('failed to bind smallint at ${offset}');`;
  },
  [_t.usmallint](n, offset) {
    return `if (duck.duckffi_bind_u16(p, ${offset}, ${n} | 0)) throw new Error('failed to bind usmallint at ${offset}');`;
  },
  [_t.uinteger](n, offset) {
    return `if (duck.duckffi_bind_u32(p, ${offset}, ${n} >>> 0)) throw new Error('failed to bind uinteger at ${offset}');`;
  },
  [_t.timestamp](n, offset) {
    return `if (duck.duckffi_bind_timestamp(p, ${offset}, ${n})) throw new Error('failed to bind timestamp at ${offset}');`;
  },
  [_t.blob](n, offset) {
    return `if (duck.duckffi_bind_blob(p, ${offset}, ptr(${n}), ${n}.byteLength)) throw new Error('failed to bind blob at ${offset}');`;
  },

  [_t.varchar](n, offset) {
    return `
      const ${n}_utf8 = utf8e.encode(${n});
      if (duck.duckffi_bind_string(p, ${offset}, ptr(${n}_utf8), ${n}_utf8.length)) throw new Error('failed to bind varchar at ${offset}');
    `;
  },

  [_t.interval](n, offset) {
    return `
      if (type === 'string') {
        ${_trm[_t.varchar](n, offset)};
      } else {
        if (duck.duckffi_bind_interval(p, ${offset}, ${n}.ms, ${n}.days, ${n}.months)) throw new Error('failed to bind interval at ${offset}');
      }
    `;
  },
};

const _trmc = {
  [_t.enum](n) {
    return `(type === 'string')`;
  },
  [_t.float](n) {
    return `(type === 'number')`;
  },
  [_t.double](n) {
    return `(type === 'number')`;
  },
  [_t.varchar](n) {
    return `(type === 'string')`;
  },
  [_t.boolean](n) {
    return `(type === 'boolean')`;
  },
  [_t.time](n) {
    return `(type === 'string') || (type === 'number')`;
  },
  [_t.date](n) {
    return `(type === 'number') || (type === 'string')`;
  },
  [_t.timestamp](n) {
    return `(type === 'number') || (type === 'bigint')`;
  },
  [_t.utinyint](n) {
    return `(type === 'number') && (0 <= ${n}) && (${n} <= 255)`;
  },
  [_t.tinyint](n) {
    return `(type === 'number') && (${n} <= 127) && (${n} >= -127)`;
  },
  [_t.usmallint](n) {
    return `(type === 'number') && (0 <= ${n}) && (${n} <= 65535)`;
  },
  [_t.blob](n) {
    return `(ArrayBuffer.isView(${n})) || (${n} instanceof ArrayBuffer)`;
  },
  [_t.uinteger](n) {
    return `(type === 'number') && (0 <= ${n}) && (${n} <= 4294967295)`;
  },
  [_t.smallint](n) {
    return `(type === 'number') && (${n} <= 32767) && (${n} >= -32767)`;
  },
  [_t.integer](n) {
    return `(type === 'number') && (${n} <= 2147483647) && (${n} >= -2147483647)`;
  },
  [_t.ubigint](n) {
    return `(type === 'bigint') && (0n <= ${n}) && (${n} <= 18446744073709551615n)`;
  },
  [_t.bigint](n) {
    return `(type === 'bigint') && (${n} <= 9223372036854775807n) && (${n} >= -9223372036854775807n)`;
  },
  [_t.interval](n) {
    return `(type === 'string') || ((type === 'object') && ('number' === typeof ${n}.ms) && ('number' === typeof ${n}.days) && ('number' === typeof ${n}.months))`;
  },
};

export function prepare(c, query) {
  const p = duck.duckffi_prepare(c, ptr(utf8e.encode(query + "\0")));

  {
    const e = duck.duckffi_prepare_error(p);

    if (e) {
      const s = getCString(e);
      throw (duck.duckffi_free_prepare(p), new Error(s));
    }
  }

  const ctx = {};
  prepare_gc.register(ctx, p, ctx);
  const len = duck.duckffi_param_count(p);

  const types = new Array(len);
  const names = new Array(len);

  for (let offset = 0; len > offset; offset++) {
    types[offset] = duck.duckffi_param_type(p, offset);
    names[offset] = `$${offset}_${_tr[types[offset]]}`;
  }

  ctx.close = () => {
    prepare_gc.unregister(ctx);
    duck.duckffi_free_prepare(p);
  };

  ctx.query = new Function(
    ...names,
    `
    function ptr(v) { return Deno.UnsafePointer.of(v) };
    function getCString(v) {
      const view = new Deno.UnsafePointerView(v);
      return view.getCString();
    }
    const { p, _tm, ctx, duck, utf8e, bitmap_get } = this;

    ${names
      .map(
        (name, offset) => `
      if (null === ${name}) duck.duckffi_bind_null(p, ${offset});
      else {
        const type = typeof ${name};
        if (!(${_trmc[types[offset]](name)})) throw new TypeError('expected ${
          _tr[types[offset]]
        } at ${offset}');

        ${_trm[types[offset]](name, offset)}
      }
    `
      )
      .join("\n")}

    const r = duck.duckffi_query_prepared(p);

    {
      const e = duck.duckffi_result_error(r);

      if (e) {
        const s = getCString(e);
        throw (duck.duckffi_free_result(r), new Error(s));
      }
    }

    const rows = duck.duckffi_row_count(r);
    const columns = duck.duckffi_column_count(r);

    const a = new Array(rows);
    const names = new Array(columns);
    const types = new Array(columns);
    const ltypes = new Array(columns);
    const typesfn = new Array(columns);

    for (let offset = 0; offset < columns; offset++) {
      types[offset] = duck.duckffi_column_type(r, offset);
      typesfn[offset] = _tm[types[offset]](r, ltypes, offset);
      names[offset] = getCString(duck.duckffi_column_name(r, offset));
    }

    try {
      {
        ctx.query = new Function(${names.map((n) => `'${n}', `).join("")} \`
          function ptr(v) { return Deno.UnsafePointer.of(v) };
          function toArrayBuffer(v, start, offset) { 
            const view = new Deno.UnsafePointerView(v);
          }
          const { p, _tm, duck, utf8e, bitmap_get } = this;

          ${names
            .map(
              (name, offset) => `
            if (null === ${name}) duck.duckffi_bind_null(p, ${offset});
            else {
              const type = typeof ${name};
              if (!(${_trmc[types[offset]](
                name
              )})) throw new TypeError('expected ${
                _tr[types[offset]]
              } at ${offset}');

              ${_trm[types[offset]](name, offset)}
            }
          `
            )
            .join("\n")}

          const r = duck.duckffi_query_prepared(p);

          {
            const e = duck.duckffi_result_error(r);

            if (e) {
              const s = new CString(e);
              throw (duck.duckffi_free_result(r), new Error(s));
            }
          }

          const rows = duck.duckffi_row_count(r);
          const ltypes = new Array(\${ltypes.length});
          if (0 === rows) return (duck.duckffi_free_result(r), []);

          \${types.map((type, column) => \`
            const _tm_\${column}_\${type} = _tm[\${type}](r, ltypes, \${column});
            const nulls_\${column} = duck.duckffi_null_bitmap(r, rows, \${column});
            const nulls_view_\${column} = new Uint8Array(toArrayBuffer(nulls_\${column}, 0, Math.ceil(rows / 8)));
          \`).join('\\n')}

          try {
            const a = new Array(rows);

            for (let offset = 0; rows > offset; offset++) {
              a[offset] = {
                \${names.map((name, column) => \`
                  "\${name}": (bitmap_get(nulls_view_\${column}, offset)) ? null : _tm_\${column}_\${types[column]}(offset, \${column}),
                \`.trim()).join('\\n')}
              };
            }

            return a;
          } finally {
            for (let offset = 0; \${ltypes.length} > offset; offset++) {
              const x = ltypes[offset];
              if (x) duck.duckffi_free_ltype(x);
            }

            \${new Array(columns).fill(0).map((_, column) => \`
              duck.duckffi_free(nulls_\${column});
            \`).join('\\n')}

            duck.duckffi_free_result(r);
          }
        \`).bind({ p, _tm, ctx, duck, utf8e, bitmap_get });
      }

      for (let offset = 0; rows > offset; offset++) {
        const row = a[offset] = {};

        for (let column = 0; column < columns; column++) {
          if (duck.duckffi_value_is_null(r, offset, column)) {
            row[names[column]] = null;
          } else {
            row[names[column]] = typesfn[column](offset, column);
          }
        }
      }

      return a;
    } finally {
      const len = ltypes.length;

      for (let offset = 0; len > offset; offset++) {
        const x = ltypes[offset];
        if (x) duck.duckffi_free_ltype(x);
      }

      duck.duckffi_free_result(r);
    }
  `
  ).bind({ p, _tm, ctx, duck, utf8e, bitmap_get });

  ctx.stream = new GeneratorFunction(
    ...names,
    `
    function ptr(v) { return Deno.UnsafePointer.of(v) };
    function getCString(v) {
      const view = new Deno.UnsafePointerView(v);
      return view.getCString();
    }
    const GeneratorFunction = (function* () { }).constructor;
    const { p, _tm, ctx, _tms, duck, utf8e, ltype_gc, result_gc } = this;

    ${names
      .map(
        (name, offset) => `
      if (null === ${name}) duck.duckffi_bind_null(p, ${offset});
      else {
        const type = typeof ${name};
        if (!(${_trmc[types[offset]](name)})) throw new TypeError('expected ${
          _tr[types[offset]]
        } at ${offset}');

        ${_trm[types[offset]](name, offset)}
      }
    `
      )
      .join("\n")}

    const r = duck.duckffi_query_prepared(p);

    const t = {};
    result_gc.register(t, r, t);

    {
      const e = duck.duckffi_result_error(r);

      if (e) {
        const s = getCString(e);
        throw (duck.duckffi_free_result(r), new Error(s));
      }
    }

    const slow = duck.duckffi_row_count_large(r);
    const columns = duck.duckffi_column_count(r);

    const names = new Array(columns);
    const types = new Array(columns);
    const ltypes = new Array(columns);
    const typesfn = new Array(columns);

    for (let offset = 0; offset < columns; offset++) {
      types[offset] = duck.duckffi_column_type(r, offset);
      names[offset] = getCString(duck.duckffi_column_name(r, offset));
      typesfn[offset] = (!slow ? _tm : _tms)[types[offset]](r, ltypes, offset);
    }

    const len = ltypes.length;

    for (let offset = 0; len > offset; offset++) {
      const x = ltypes[offset];
      if (x) ltype_gc.register(t, x, t);
    }

    try {
      {
        ctx.stream = new GeneratorFunction(${names
          .map((n) => `'${n}', `)
          .join("")} \`
          function ptr(v) { return Deno.UnsafePointer.of(v) };
          function getCString(v) {
            const view = new Deno.UnsafePointerView(v);
            return view.getCString();
          }
          const { p, _tm, _tms, duck, utf8e, ltype_gc, result_gc } = this;

          ${names
            .map(
              (name, offset) => `
            if (null === ${name}) duck.duckffi_bind_null(p, ${offset});
            else {
              const type = typeof ${name};
              if (!(${_trmc[types[offset]](
                name
              )})) throw new TypeError('expected ${
                _tr[types[offset]]
              } at ${offset}');

              ${_trm[types[offset]](name, offset)}
            }
          `
            )
            .join("\n")}

          const r = duck.duckffi_query_prepared(p);

          {
            const e = duck.duckffi_result_error(r);

            if (e) {
              const s = getCString(e);
              throw (duck.duckffi_free_result(r), new Error(s));
            }
          }

          const t = {};
          result_gc.register(t, r, t);
          const ltypes = new Array(\${len});
          const slow = duck.duckffi_row_count_large(r);

          try {
            if (!slow) {
              const rows = duck.duckffi_row_count(r);

              \${types.map((type, column) => \`
                const _tm_\${column}_\${type} = _tm[\${type}](r, ltypes, \${column});
              \`).join('\\n')}

              for (let offset = 0; \${len} > offset; offset++) {
                const x = ltypes[offset];
                if (x) ltype_gc.register(t, x, t);
              }

              for (let offset = 0; rows > offset; offset++) {
                yield {
                  \${names.map((name, column) => \`
                    "\${name}": duck.duckffi_value_is_null(r, offset, \${column}) ? null : _tm_\${column}_\${types[column]}(offset, \${column}),
                  \`.trim()).join('\\n')}
                };
              }
            } else {
              const rows = duck.duckffi_row_count_slow(r);

              \${types.map((type, column) => \`
                const _tms_\${column}_\${type} = _tms[\${type}](r, ltypes, \${column});
              \`).join('\\n')}

              for (let offset = 0; \${len} > offset; offset++) {
                const x = ltypes[offset];
                if (x) ltype_gc.register(t, x, t);
              }

              for (let offset = 0n; rows > offset; offset++) {
                yield {
                  \${names.map((name, column) => \`
                    "\${name}": duck.duckffi_value_is_null_slow(r, offset, \${column}) ? null : _tms_\${column}_\${types[column]}(offset, \${column}),
                  \`.trim()).join('\\n')}
                };
              }
            }
          } finally {
            for (let offset = 0; \${len} > offset; offset++) {
              const x = ltypes[offset];
              if (x) duck.duckffi_free_ltype(x);
            }

            ltype_gc.unregister(t);
            result_gc.unregister(t);
            duck.duckffi_free_result(r);
          }
        \`).bind({ p, _tm, ctx, _tms, duck, utf8e, ltype_gc, result_gc });
      }

      if (!slow) {
        const rows = duck.duckffi_row_count(r);

        for (let offset = 0; rows > offset; offset++) {
          const row = {};

          for (let column = 0; column < columns; column++) {
            if (duck.duckffi_value_is_null(r, offset, column)) {
              row[names[column]] = null;
            } else {
              row[names[column]] = typesfn[column](offset, column);
            }
          }

          yield row;
        }
      } else {
        const rows = duck.duckffi_row_count_slow(r);

        for (let offset = 0n; rows > offset; offset++) {
          const row = {};

          for (let column = 0; column < columns; column++) {
            if (duck.duckffi_value_is_null_slow(r, offset, column)) {
              row[names[column]] = null;
            } else {
              row[names[column]] = typesfn[column](offset, column);
            }
          }

          yield row;
        }
      }
    } finally {
      for (let offset = 0; len > offset; offset++) {
        const x = ltypes[offset];
        if (x) duck.duckffi_free_ltype(x);
      }

      ltype_gc.unregister(t);
      result_gc.unregister(t);
      duck.duckffi_free_result(r);
    }
  `
  ).bind({ p, _tm, ctx, _tms, duck, utf8e, ltype_gc, result_gc });

  ctx.c = null;

  return ctx;
}
