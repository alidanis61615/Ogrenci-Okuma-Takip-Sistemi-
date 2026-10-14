const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const root = path.join(__dirname, "..");
function setup(saved) {
  const dom = new JSDOM(
    fs.readFileSync(path.join(root, "index.html"), "utf8"),
    { url: "https://okutrack.example/", runScripts: "outside-only" },
  );
  const { window } = dom;
  const alerts = [];
  window.TextEncoder = TextEncoder;
  window.confirm = () => true;
  window.alert = (message) => alerts.push(message);
  window.URL.createObjectURL = () => "blob:test";
  window.URL.revokeObjectURL = () => {};
  window.HTMLAnchorElement.prototype.click = () => {};
  if (saved !== undefined) window.localStorage.setItem("okutrack-v1", saved);
  window.eval(fs.readFileSync(path.join(root, "core.js"), "utf8"));
  window.eval(fs.readFileSync(path.join(root, "app.js"), "utf8"));
  return {
    dom,
    window,
    alerts,
    element: (id) => window.document.getElementById(id),
    submit: (id) =>
      window.document
        .getElementById(id)
        .dispatchEvent(
          new window.Event("submit", { bubbles: true, cancelable: true }),
        ),
  };
}

test("Student, book, reading, goal and analysis work together and survive reload", () => {
  const app = setup();
  let reload;
  try {
    app.element("studentName").value = "Ali";
    app.submit("studentForm");
    app.element("bookTitle").value = "Küçük Prens";
    app.submit("bookForm");
    app.element("readingStudent").selectedIndex = 1;
    app.element("readingBook").selectedIndex = 1;
    app.element("readingPages").value = 25;
    app.element("readingMinutes").value = 15;
    app.submit("readingForm");
    app.element("dailyGoal").value = 40;
    app.submit("goalForm");
    assert.equal(app.element("pageCount").textContent, "25");
    assert.equal(app.element("goalBar").style.width, "62.5%");
    app.element("analysisStudent").selectedIndex = 1;
    app
      .element("analysisStudent")
      .dispatchEvent(new app.window.Event("change"));
    assert.equal(app.element("analysisPages").textContent, "25");
    assert.equal(app.element("analysisBooks").textContent, "1");
    reload = setup(app.window.localStorage.getItem("okutrack-v1"));
    assert.equal(reload.element("studentCount").textContent, "1");
    assert.equal(reload.element("pageCount").textContent, "25");
    assert.deepEqual(app.alerts, []);
  } finally {
    app.dom.window.close();
    reload?.dom.window.close();
  }
});
test("Importing an invalid file preserves records and reports the failure", async () => {
  const app = setup();
  try {
    app.element("studentName").value = "Ali";
    app.submit("studentForm");
    const before = app.window.localStorage.getItem("okutrack-v1");
    const input = app.element("importFile");
    Object.defineProperty(input, "files", {
      value: [{ size: 20, text: async () => '{"students":[]}' }],
    });
    await input.onchange({ target: input });
    assert.equal(app.window.localStorage.getItem("okutrack-v1"), before);
    assert.equal(app.element("studentCount").textContent, "1");
    assert.match(app.alerts.at(-1), /Yedek yüklenemedi/);
  } finally {
    app.dom.window.close();
  }
});
test("Unreadable existing records remain available for recovery and cannot be silently overwritten", () => {
  const raw = '{"bozuk":true}';
  const app = setup(raw);
  try {
    assert.equal(app.element("dataWarning").hidden, false);
    app.element("studentName").value = "Ali";
    app.submit("studentForm");
    assert.equal(app.window.localStorage.getItem("okutrack-v1"), raw);
    assert.equal(app.element("studentCount").textContent, "0");
    assert.match(app.alerts.at(-1), /kurtarma yedeğini/);
  } finally {
    app.dom.window.close();
  }
});
test("Storage quota failure does not show an unsaved student as persisted", () => {
  const app = setup();
  try {
    app.window.Storage.prototype.setItem = () => {
      throw new Error("quota");
    };
    app.element("studentName").value = "Ali";
    app.submit("studentForm");
    assert.equal(app.element("studentCount").textContent, "0");
    assert.match(app.alerts.at(-1), /Kayıt kaydedilemedi/);
  } finally {
    app.dom.window.close();
  }
});
test("Sample data renders student rankings and all seven chart days", () => {
  const app = setup();
  try {
    app.element("demoBtn").click();
    assert.equal(app.element("studentCount").textContent, "3");
    assert.equal(app.element("bookCount").textContent, "3");
    assert.equal(app.element("chart").children.length, 7);
    assert.equal(app.element("leaderboard").children.length, 3);
    assert.ok(Number(app.element("pageCount").textContent) > 0);
  } finally {
    app.dom.window.close();
  }
});
