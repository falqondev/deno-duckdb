import { connect, open, prepare, query } from "./lib.js";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
const db = open(":memory:");
  const connection = connect(db);

  const r = query(
    connection,
    `
    create type mood as enum ('sad', 'ok', 'happy');

    create table test (a varchar, m mood);
    insert into test (a, m) values ('a', 'sad');
  `,
  );
  console.log(r)
  
Deno.test("select * from test", () => {
  const db = open(":memory:");
  const connection = connect(db);

  const r = query(
    connection,
    `
    create type mood as enum ('sad', 'ok', 'happy');

    create table test (a varchar, m mood);
    insert into test (a, m) values ('a', 'sad');
  `,
  );
  console.log(r)

  const p = prepare(connection, `select * from test`);
  assertEquals(p.query(), [{ a: "a", m: "sad" }]);
});

Deno.test("fts", () => {
  const db = open(":memory:");
  const connection = connect(db);

  query(
    connection,
    `
    install 'fts'; load 'fts';
  `,
  );
});
