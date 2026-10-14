"use strict";
const Core = window.OkuTrackCore;
const KEY = "okutrack-v1";
let state = Core.blank(),
  unreadableBackup = null,
  initialStorageError = null;
try {
  const raw = localStorage.getItem(KEY);
  if (raw !== null) {
    try {
      state = Core.parseBackup(raw);
    } catch {
      unreadableBackup = raw;
    }
  }
} catch {
  initialStorageError =
    "Tarayıcı kayıtları okunamadı. Kayıt iznini kontrol edip yeniden deneyin.";
}
const $ = (id) => document.getElementById(id);
const uid = () =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Date.now() + "-" + Math.random().toString(36).slice(2);
const localDate = (d) => {
  const x = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return x.toISOString().slice(0, 10);
};
const today = () => localDate(new Date());
const node = (tag, txt, cls) => {
  const e = document.createElement(tag);
  e.textContent = txt;
  if (cls) e.className = cls;
  return e;
};
function save(next, allowReplacement = false) {
  try {
    if (unreadableBackup && !allowReplacement)
      throw new Error(
        "Önce kurtarma yedeğini indirin veya doğrulanmış bir JSON yedeği yükleyin.",
      );
    const committed = Core.saveState(localStorage, KEY, next);
    state = committed;
    unreadableBackup = null;
    initialStorageError = null;
    render();
    return true;
  } catch (error) {
    alert("Kayıt kaydedilemedi: " + error.message);
    return false;
  }
}
function option(select, id, label) {
  const o = document.createElement("option");
  o.value = id;
  o.textContent = label;
  select.append(o);
}
function fillSelect(id, items, placeholder, all = false) {
  const el = $(id),
    old = el.value;
  el.replaceChildren();
  option(el, all ? "" : "", placeholder);
  items.forEach((x) => option(el, x.id, x.name || x.title));
  if ([...el.options].some((x) => x.value === old)) el.value = old;
}
function list(id, items, describe, remove) {
  const el = $(id);
  el.replaceChildren();
  if (!items.length) {
    el.append(node("p", "Henüz kayıt yok.", "muted"));
    return;
  }
  items.forEach((item) => {
    const row = node("div", "", "entry"),
      info = node("div", "");
    info.append(node("strong", describe(item)));
    const btn = node("button", "Sil", "danger");
    btn.type = "button";
    btn.addEventListener("click", () => remove(item.id));
    row.append(info, btn);
    el.append(row);
  });
}
function removeStudent(id) {
  if (confirm("Öğrenci ve ona ait okuma kayıtları silinsin mi?"))
    save(Core.removeStudent(state, id));
}
function removeBook(id) {
  if (confirm("Kitap ve ona ait okuma kayıtları silinsin mi?"))
    save(Core.removeBook(state, id));
}
function removeReading(id) {
  save({ ...state, readings: state.readings.filter((item) => item.id !== id) });
}
function render() {
  $("dataWarning").hidden = !unreadableBackup && !initialStorageError;
  $("dataWarningText").textContent = unreadableBackup
    ? "Kaydedilmiş veriler doğrulanamadı. Orijinal verileriniz değiştirilmedi. Kurtarma yedeğini indirip kontrol edebilirsiniz."
    : initialStorageError || "";
  $("recoveryBtn").hidden = !unreadableBackup;

  $("studentCount").textContent = state.students.length;
  $("bookCount").textContent = state.books.length;
  $("pageCount").textContent = state.readings
    .reduce((a, x) => a + Number(x.pages), 0)
    .toLocaleString("tr-TR");
  $("minuteCount").textContent = state.readings
    .reduce((a, x) => a + Number(x.minutes), 0)
    .toLocaleString("tr-TR");
  list("students", state.students, (x) => x.name, removeStudent);
  list(
    "books",
    state.books,
    (x) => x.title + (x.author ? " — " + x.author : ""),
    removeBook,
  );
  fillSelect("analysisStudent", state.students, "Öğrenci seç");
  const selectedAnalysis = $("analysisStudent").value;
  const totals = Core.analysis(state, selectedAnalysis);
  $("analysisPages").textContent = totals.pages.toLocaleString("tr-TR");
  $("analysisMinutes").textContent = totals.minutes.toLocaleString("tr-TR");
  $("analysisBooks").textContent = totals.books;
  $("analysisDays").textContent = totals.days;
  fillSelect("readingStudent", state.students, "Öğrenci seç");
  fillSelect("readingBook", state.books, "Kitap seç");
  fillSelect("filterStudent", state.students, "Tüm öğrenciler", true);
  const selected = $("filterStudent").value,
    entries = state.readings
      .filter((x) => !selected || x.studentId === selected)
      .sort((a, b) => b.date.localeCompare(a.date));
  const area = $("readings");
  area.replaceChildren();
  if (!entries.length)
    area.append(node("p", "Bu filtrede okuma kaydı bulunmuyor.", "muted"));
  entries.forEach((x) => {
    const row = node("div", "", "entry"),
      info = node("div", ""),
      s = state.students.find((y) => y.id === x.studentId),
      b = state.books.find((y) => y.id === x.bookId);
    info.append(
      node(
        "strong",
        (s?.name || "Silinmiş öğrenci") +
          " • " +
          (b?.title || "Silinmiş kitap"),
      ),
    );
    info.append(
      node(
        "small",
        x.date + " • " + x.pages + " sayfa • " + x.minutes + " dakika",
      ),
    );
    const btn = node("button", "Sil", "danger");
    btn.onclick = () => removeReading(x.id);
    row.append(info, btn);
    area.append(row);
  });
  $("dailyGoal").value = state.goal;
  const done = state.readings
    .filter((x) => x.date === today())
    .reduce((a, x) => a + Number(x.pages), 0);
  $("goalText").textContent = "Bugün: " + done + " / " + state.goal + " sayfa";
  $("goalBar").style.width = Math.min(100, (100 * done) / state.goal) + "%";
  const leaderboard = $("leaderboard");
  leaderboard.replaceChildren();
  const ranking = state.students
    .map((student) => ({
      name: student.name,
      pages: state.readings
        .filter((r) => r.studentId === student.id)
        .reduce((n, r) => n + Number(r.pages), 0),
    }))
    .sort((a, b) => b.pages - a.pages);
  if (!ranking.length)
    leaderboard.append(node("p", "Henüz öğrenci eklenmedi.", "muted"));
  ranking.forEach((x, i) => {
    const row = node("div", "", "entry");
    row.append(
      node("strong", i + 1 + ". " + x.name),
      node("span", x.pages + " sayfa"),
    );
    leaderboard.append(row);
  });
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return localDate(d);
  });
  const vals = days.map((d) =>
      state.readings
        .filter((x) => x.date === d)
        .reduce((a, x) => a + Number(x.pages), 0),
    ),
    max = Math.max(1, ...vals);
  const chart = $("chart");
  chart.replaceChildren();
  days.forEach((d, i) => {
    const bar = node("div", "", "day"),
      n = node("span", String(vals[i])),
      stick = node("i", ""),
      label = node("span", d.slice(5));
    stick.style.height = Math.max(2, (vals[i] / max) * 100) + "px";
    bar.append(n, stick, label);
    chart.append(bar);
  });
}

function download(contents, type, name) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function action(callback) {
  try {
    callback();
  } catch (error) {
    alert(error.message);
  }
}
$("readingDate").value = today();
$("studentForm").onsubmit = (event) => {
  event.preventDefault();
  action(() => {
    if (save(Core.addStudent(state, $("studentName").value, uid())))
      event.target.reset();
  });
};
$("bookForm").onsubmit = (event) => {
  event.preventDefault();
  action(() => {
    if (
      save(
        Core.addBook(state, $("bookTitle").value, $("bookAuthor").value, uid()),
      )
    )
      event.target.reset();
  });
};
$("readingForm").onsubmit = (event) => {
  event.preventDefault();
  action(() => {
    const reading = {
      id: uid(),
      studentId: $("readingStudent").value,
      bookId: $("readingBook").value,
      pages: Number($("readingPages").value),
      minutes: Number($("readingMinutes").value),
      date: $("readingDate").value,
    };
    if (save(Core.addReading(state, reading))) {
      event.target.reset();
      $("readingDate").value = today();
    }
  });
};
$("goalForm").onsubmit = (event) => {
  event.preventDefault();
  save({ ...state, goal: Number($("dailyGoal").value) });
};
$("filterStudent").onchange = render;
$("analysisStudent").onchange = render;
$("csvBtn").onclick = () =>
  download(
    Core.toCSV(state),
    "text/csv;charset=utf-8",
    "okutrack-rapor-" + today() + ".csv",
  );
$("exportBtn").onclick = () =>
  download(
    JSON.stringify(state, null, 2),
    "application/json",
    "okutrack-yedek-" + today() + ".json",
  );
$("recoveryBtn").onclick = () =>
  download(
    unreadableBackup,
    "application/json",
    "okutrack-kurtarma-" + today() + ".json",
  );
$("importFile").onchange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > Core.MAX_BACKUP_BYTES) throw new Error("Dosya çok büyük.");
    const restored = Core.restoreBackup(
      localStorage,
      KEY,
      await file.text(),
      () => confirm("Mevcut kayıtlar yedekle değiştirilsin mi?"),
    );
    if (restored) {
      state = restored;
      unreadableBackup = null;
      initialStorageError = null;
      render();
    }
  } catch (error) {
    alert("Yedek yüklenemedi: " + error.message);
  } finally {
    event.target.value = "";
  }
};
$("demoBtn").onclick = () => {
  if (
    !confirm(
      "Örnek veri yüklemek mevcut kayıtların yerine geçecek. Devam edilsin mi?",
    )
  )
    return;
  const names = ["Ayşe Yılmaz", "Mehmet Demir", "Zeynep Kaya"],
    titles = [
      ["Küçük Prens", "Antoine de Saint-Exupéry"],
      ["Şeker Portakalı", "José Mauro de Vasconcelos"],
      ["Martı", "Richard Bach"],
    ];
  const students = names.map((name) => ({ id: uid(), name })),
    books = titles.map(([title, author]) => ({ id: uid(), title, author })),
    readings = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    students.forEach((student, j) => {
      if ((i + j) % 4 === 0) return;
      readings.push({
        id: uid(),
        studentId: student.id,
        bookId: books[(i + j) % books.length].id,
        pages: 10 + ((i * 7 + j * 11) % 32),
        minutes: 15 + ((i * 9 + j * 8) % 40),
        date: localDate(date),
      });
    });
  }
  if (save({ students, books, readings, goal: 60 }, true))
    alert(
      "Örnek veriler yüklendi. Artık grafikleri ve sıralamayı inceleyebilirsin.",
    );
};
$("clearBtn").onclick = () => {
  if (
    confirm(
      "Tüm veriler kalıcı olarak silinsin mi? Önce yedek almanı öneririz.",
    )
  )
    save(Core.blank(), true);
};
render();
