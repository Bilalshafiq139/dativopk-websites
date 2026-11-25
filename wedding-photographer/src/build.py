# Wraps each page body in src/pages/*.html with the shared <head>. Run: python src/build.py
import os, re
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = open(os.path.join(root, "src", "head.html"), encoding="utf-8").read()
for f in sorted(os.listdir(os.path.join(root, "src", "pages"))):
    raw = open(os.path.join(root, "src", "pages", f), encoding="utf-8").read()
    meta = dict(re.findall(r"^<!--\s*(\w+):\s*(.*?)\s*-->$", raw, re.M))
    body = re.sub(r"^<!--\s*\w+:.*?-->\n", "", raw, flags=re.M)
    html = HEAD.replace("{{title}}", meta["title"]).replace("{{desc}}", meta["desc"]).replace("{{page}}", f[:-5])
    open(os.path.join(root, f), "w", encoding="utf-8", newline="\n").write(html + body + '<script type="module" src="js/main.js"></script>\n</body>\n</html>\n')
    print("built", f)
