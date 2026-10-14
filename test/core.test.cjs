const { test } = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../core.js");

const fixture = () => ({
  students: [{ id: "s1", name: "Ali" }],
  books: [{ id: "b1", title: "Küçük Prens", author: "Saint-Exupéry" }],
  readings: [
    {
      id: "r1",
      studentId: "s1",
      bookId: "b1",
      date: "2026-10-14",
      pages: 20,
      minutes: 15,
    },
  ],
  goal: 30,
});
const storage = (value) => ({
  value,
  writes: 0,
  setItem(key, next) {
    this.value = next;
    this.writes++;
  },
});

test("Existing backups round trip and unknown fields are removed", () => {
  const input = fixture();
  input.students[0].extra = true;
  assert.deepEqual(Core.parseBackup(JSON.stringify(input)), fixture());
});
for (const [field, value] of [
  ["pages", 1.5],
  ["pages", "20"],
  ["minutes", 1441],
  ["date", "2026-02-30"],
  ["date", "yesterday"],
  ["studentId", "missing"],
  ["bookId", "missing"],
]) {
  test(`Rejects invalid reading ${field}: ${value}`, () => {
    const input = fixture();
    input.readings[0][field] = value;
    assert.throws(() => Core.parseBackup(JSON.stringify(input)));
  });
}
test("Dates respect leap years and reject year zero", () => {
  assert.equal(Core.validDate("2024-02-29"), true);
  assert.equal(Core.validDate("2025-02-29"), false);
  assert.equal(Core.validDate("0000-01-01"), false);
});
test("Duplicate identifiers and empty names are rejected", () => {
  const input = fixture();
  input.students.push({ id: "s1", name: "Other" });
  assert.throws(() => Core.validateState(input));
  input.students = [{ id: "s1", name: " " }];
  assert.throws(() => Core.validateState(input));
});
test("Goals, malformed JSON and UTF-8 byte limits are validated", () => {
  for (const goal of [0, -1, 1.5, "30", 10001, Infinity])
    assert.throws(() => Core.validateState({ ...fixture(), goal }));
  assert.throws(() => Core.parseBackup("{"));
  assert.throws(() => Core.parseBackup("ş".repeat(1_000_001)), /2 MB/);
});
test("Invalid restoration neither confirms nor changes saved data", () => {
  const saved = JSON.stringify(fixture());
  const db = storage(saved);
  let confirmations = 0;
  assert.throws(() =>
    Core.restoreBackup(db, "key", '{"students":[]}', () => {
      confirmations++;
      return true;
    }),
  );
  assert.equal(confirmations, 0);
  assert.equal(db.writes, 0);
  assert.equal(db.value, saved);
});
test("Cancelling restoration preserves saved data", () => {
  const db = storage("original");
  assert.equal(
    Core.restoreBackup(db, "key", JSON.stringify(fixture()), () => false),
    null,
  );
  assert.equal(db.writes, 0);
  assert.equal(db.value, "original");
});
test("A storage failure propagates without mutating the input", () => {
  const input = fixture();
  const before = structuredClone(input);
  assert.throws(
    () =>
      Core.saveState(
        {
          setItem() {
            throw new Error("quota");
          },
        },
        "key",
        input,
      ),
    /quota/,
  );
  assert.deepEqual(input, before);
});
test("Deleting a student or book removes related readings without mutating the original", () => {
  const input = fixture();
  assert.equal(Core.removeStudent(input, "s1").readings.length, 0);
  assert.equal(Core.removeBook(input, "b1").readings.length, 0);
  assert.equal(input.readings.length, 1);
});
test("Analysis counts pages, minutes, distinct books and days", () => {
  const input = fixture();
  input.books.push({ id: "b2", title: "Martı", author: "" });
  input.readings.push({
    id: "r2",
    studentId: "s1",
    bookId: "b2",
    date: "2026-10-15",
    pages: 10,
    minutes: 8,
  });
  assert.deepEqual(Core.analysis(input, "s1"), {
    pages: 30,
    minutes: 23,
    books: 2,
    days: 2,
  });
});
test("CSV supports Turkish text, quotes and spreadsheet formula protection", () => {
  const input = fixture();
  input.students[0].name = "  =SUM(A1)";
  input.books[0].title = 'Kitap "bir"';
  const csv = Core.toCSV(input);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes('"\'  =SUM(A1)"'));
  assert.ok(csv.includes('"Kitap ""bir"""'));
});
