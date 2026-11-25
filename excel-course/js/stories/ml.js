// Machine Learning story in a notebook: dataset → explore → train → evaluate → live prediction
import { runStory, chrome, typer } from "../story-core.js";

const CELLS = [
  `import pandas as pd\ndf = pd.read_csv("customers.csv")\ndf.head()`,
  `sns.scatterplot(data=df, x="tenure_months",\n                y="monthly_bill", hue="churned")`,
  `model = GradientBoostingClassifier(n_estimators=200)\nmodel.fit(X_train, y_train)`,
  `pred = model.predict(X_test)\nprint(classification_report(y_test, pred))`,
  `model.predict_proba(new_customer)[0][1]`,
];
const SHORT = ["read_csv", "scatterplot", "model.fit", "classification_report", "predict_proba"];
const STATUS = [
  ["Kernel: Python 3 · idle", "5,000 rows × 5 columns"],
  ["Kernel: Python 3 · idle", "Pattern: short tenure + high bill"],
  ["Kernel: Python 3 · busy", "Training 200 trees"],
  ["Kernel: Python 3 · idle", "Test accuracy 89%"],
  ["Model deployed · v1.0", "Scores 5,000 customers nightly"],
];

export function init({ mount, story, onStage }) {
  const c = chrome({ icon: "◆", name: "churn_model.ipynb", note: "Python 3", tabs: ["Dataset", "Explore", "Train", "Evaluate", "Predict"] });
  c.el.classList.add("ml");
  // deterministic scatter points
  let s = 5; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pts = [...Array(70)].map(() => {
    const churn = r() < .35;
    const x = churn ? 6 + r() * 40 : 20 + r() * 170;
    const y = churn ? 70 + r() * 60 : 25 + r() * 110;
    return [x, 140 - y, churn];
  });
  const loss = [...Array(30)].map((_, i) => [i * 10, 90 - 76 * Math.exp(-i / 6) - (i % 3) * 1.5]);
  c.body.innerHTML = `
  <div class="nb-hist">${SHORT.map((t, i) => `<span data-i="${i}">In [${i + 1}] ${t} <b>✓</b></span>`).join("")}</div>
  <div class="nb-cell"><span class="nb-in">In [<b class="nb-n">1</b>]:</span><pre class="code"></pre></div>
  <div class="nb-out">
    <div class="o o0"><table><thead><tr><th></th><th>tenure_months</th><th>monthly_bill</th><th>complaints</th><th>plan</th><th>churned</th></tr></thead><tbody>
      ${[[0, 4, "6,800", 3, "Basic", 1], [1, 38, "2,900", 0, "Family", 0], [2, 12, "5,400", 1, "Basic", 0], [3, 2, "7,100", 4, "Basic", 1], [4, 56, "3,300", 0, "Pro", 0]].map((row, i) => `<tr style="--d:${i * 80}ms">${row.map((v, j) => `<td${j === 5 && v ? ' class="hot"' : ""}>${v}</td>`).join("")}</tr>`).join("")}</tbody></table><p>5,000 rows × 5 columns</p></div>
    <div class="o o1"><svg viewBox="0 0 220 150"><path class="ax" d="M10 4V140H216"/>${pts.map(([x, y, ch], i) => `<circle cx="${x + 14}" cy="${y}" r="3.2" class="${ch ? "ch" : ""}" style="--d:${i * 12}ms"/>`).join("")}<text x="216" y="149" text-anchor="end">tenure →</text><text x="12" y="10">bill ↑</text></svg>
      <ul><li class="ch">churned</li><li>stayed</li></ul><p>Customers who leave are new <b>and</b> on high bills.</p></div>
    <div class="o o2"><div class="prog"><span>Training</span><div><i></i></div><b class="cnt">200 / 200 trees</b></div>
      <svg viewBox="0 0 300 100"><path class="ax" d="M0 96H300"/><path class="loss" pathLength="1" d="M${loss.map(p => p.join(" ")).join("L")}"/><text x="298" y="90" text-anchor="end">training loss ↓</text></svg></div>
    <div class="o o3"><div class="acc"><small>Accuracy</small><b>89%</b><span>on 1,000 customers it never saw</span></div>
      <div class="cm"><small>Confusion matrix</small><div class="g"><i>712<em>stayed ✓</em></i><i class="w">48</i><i class="w">62</i><i class="t">178<em>churn ✓</em></i></div></div>
      <div class="fi"><small>What drives churn</small>${[["tenure", 41], ["complaints", 29], ["monthly_bill", 21], ["plan", 9]].map(([k, v], i) => `<div><span>${k}</span><i style="--w:${v * 2.2}%;--d:${i * 90}ms"></i><b>${(v / 100).toFixed(2)}</b></div>`).join("")}</div></div>
    <div class="o o4"><div class="cust"><small>New customer</small><b>Ayesha K.</b><dl><dt>Tenure</dt><dd>4 months</dd><dt>Bill</dt><dd>Rs 6,800</dd><dt>Complaints</dt><dd>3</dd></dl></div>
      <div class="gauge"><svg viewBox="0 0 120 70"><path class="bg" d="M10 62A50 50 0 0 1 110 62"/><path class="fg" pathLength="1" d="M10 62A50 50 0 0 1 110 62"/></svg><b>82%</b><span>churn risk · high</span></div>
      <div class="act"><small>Suggested action</small>Call within 48 hours and offer a 20% loyalty discount.</div></div>
  </div>`;
  const type = typer(c.body.querySelector(".code"));
  const nEl = c.body.querySelector(".nb-n"), hist = [...c.body.querySelectorAll(".nb-hist span")];
  return runStory({
    mount, story, onStage,
    app: {
      el: c.el, stages: 5, width: 820, narrowWidth: 560,
      setStage(n) {
        c.stage(n); c.status(...STATUS[n]);
        nEl.textContent = n + 1;
        hist.forEach((h, i) => h.classList.toggle("on", i < n));
        type(CELLS[n], 150, 14);
      },
    },
  });
}
