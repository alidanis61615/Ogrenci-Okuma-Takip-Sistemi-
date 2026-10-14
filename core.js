(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.OkuTrackCore = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";

  const MAX_BACKUP_BYTES = 2_000_000;
  const MAX_RECORDS = 50_000;
  const blank = () => ({ students: [], books: [], readings: [], goal: 30 });
  const record = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);
  const integer = (value, min, max) =>
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= min &&
    value <= max;
  const text = (value, max, empty = false) =>
    typeof value === "string" &&
    value.length <= max &&
    (empty || value.trim().length > 0);

  function validDate(value) {
    if (
      typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      value.startsWith("0000")
    )
      return false;
    const date = new Date(value + "T00:00:00.000Z");
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }

  function validateState(input) {
    if (!record(input) || !integer(input.goal, 1, 10_000))
      throw new Error("Günlük hedef 1–10000 arasında tam sayı olmalı.");
    for (const key of ["students", "books", "readings"]) {
      if (!Array.isArray(input[key]) || input[key].length > MAX_RECORDS)
        throw new Error("Yedekte eksik veya çok büyük bir kayıt listesi var.");
    }
    const seen = { students: new Set(), books: new Set(), readings: new Set() };
    function identifier(item, kind) {
      if (!record(item) || !text(item.id, 200) || seen[kind].has(item.id))
        throw new Error("Yedekte geçersiz veya yinelenen kayıt kimliği var.");
      seen[kind].add(item.id);
    }
    const students = input.students.map((item) => {
      identifier(item, "students");
      if (!text(item.name, 80))
        throw new Error("Öğrenci adı boş olamaz ve 80 karakteri geçemez.");
      return { id: item.id, name: item.name };
    });
    const books = input.books.map((item) => {
      identifier(item, "books");
      if (
        !text(item.title, 120) ||
        (item.author !== undefined && !text(item.author, 100, true))
      )
        throw new Error("Kitap adı veya yazar bilgisi geçersiz.");
      return { id: item.id, title: item.title, author: item.author ?? "" };
    });
    const readings = input.readings.map((item) => {
      identifier(item, "readings");
      if (!seen.students.has(item.studentId) || !seen.books.has(item.bookId))
        throw new Error(
          "Okuma kaydında bulunmayan bir öğrenci veya kitap var.",
        );
      if (!validDate(item.date))
        throw new Error("Okuma tarihi geçerli bir YYYY-AA-GG tarihi olmalı.");
      if (!integer(item.pages, 1, 10_000) || !integer(item.minutes, 1, 1_440))
        throw new Error(
          "Sayfa ve dakika değerleri izin verilen aralıkta tam sayı olmalı.",
        );
      return {
        id: item.id,
        studentId: item.studentId,
        bookId: item.bookId,
        date: item.date,
        pages: item.pages,
        minutes: item.minutes,
      };
    });
    return { students, books, readings, goal: input.goal };
  }

  function isValidState(input) {
    try {
      validateState(input);
      return true;
    } catch {
      return false;
    }
  }

  function parseBackup(raw) {
    if (
      typeof raw !== "string" ||
      new TextEncoder().encode(raw).byteLength > MAX_BACKUP_BYTES
    )
      throw new Error("Yedek dosyası 2 MB sınırını aşıyor.");
    let decoded;
    try {
      decoded = JSON.parse(raw);
    } catch {
      throw new Error("Dosya geçerli bir JSON yedeği değil.");
    }
    return validateState(decoded);
  }

  function saveState(storage, key, next) {
    const validated = validateState(next);
    const serialized = JSON.stringify(validated);
    if (new TextEncoder().encode(serialized).byteLength > MAX_BACKUP_BYTES)
      throw new Error("Kayıtlar 2 MB yedek sınırını aşıyor.");
    storage.setItem(key, serialized);
    return validated;
  }

  function restoreBackup(storage, key, raw, confirmReplace) {
    const incoming = parseBackup(raw);
    if (!confirmReplace()) return null;
    return saveState(storage, key, incoming);
  }

  function addStudent(state, name, id) {
    return validateState({
      ...state,
      students: [...state.students, { id, name: name.trim() }],
    });
  }

  function addBook(state, title, author, id) {
    return validateState({
      ...state,
      books: [
        ...state.books,
        { id, title: title.trim(), author: author.trim() },
      ],
    });
  }

  function addReading(state, reading) {
    return validateState({ ...state, readings: [...state.readings, reading] });
  }

  function removeStudent(state, id) {
    return {
      ...state,
      students: state.students.filter((item) => item.id !== id),
      readings: state.readings.filter((item) => item.studentId !== id),
    };
  }

  function removeBook(state, id) {
    return {
      ...state,
      books: state.books.filter((item) => item.id !== id),
      readings: state.readings.filter((item) => item.bookId !== id),
    };
  }

  function analysis(state, studentId) {
    const readings = state.readings.filter(
      (item) => item.studentId === studentId,
    );
    return {
      pages: readings.reduce((sum, item) => sum + item.pages, 0),
      minutes: readings.reduce((sum, item) => sum + item.minutes, 0),
      books: new Set(readings.map((item) => item.bookId)).size,
      days: new Set(readings.map((item) => item.date)).size,
    };
  }

  function quoteCSV(value) {
    let result = String(value ?? "");
    if (/^[\s]*[=+@-]/.test(result) || /^[\t\r\n]/.test(result))
      result = "'" + result;
    return '"' + result.replaceAll('"', '""') + '"';
  }

  function toCSV(state) {
    const rows = [
      ["Tarih", "Öğrenci", "Kitap", "Sayfa", "Dakika"],
      ...state.readings.map((item) => [
        item.date,
        state.students.find((student) => student.id === item.studentId)?.name ??
          "",
        state.books.find((book) => book.id === item.bookId)?.title ?? "",
        item.pages,
        item.minutes,
      ]),
    ];
    return (
      "\uFEFF" + rows.map((row) => row.map(quoteCSV).join(";")).join("\r\n")
    );
  }

  return {
    MAX_BACKUP_BYTES,
    blank,
    validDate,
    validateState,
    isValidState,
    parseBackup,
    saveState,
    restoreBackup,
    addStudent,
    addBook,
    addReading,
    removeStudent,
    removeBook,
    analysis,
    toCSV,
  };
});
