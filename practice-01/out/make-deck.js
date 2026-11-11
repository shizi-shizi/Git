const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");

const NAVY = "1E2761";
const ICE = "CADCFC";
const INK = "1A1F36";
const PANEL = "F2F5FA";
const BODY = "2E3550";

const pres = new PptxGenJS();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "yuanshiwen";
pres.company = "Pi Agent Practice";
pres.title = "Pi Agent 实践小结";

// Shared motif: concentric node rings, echoes the "agent" idea on both slides.
function nodeRings(slide, cx, cy, color, opacity, scale) {
  const sizes = [3.4, 2.6, 1.85, 1.15, 0.45].map((d) => d * scale);
  sizes.forEach((d, i) => {
    slide.addShape(pres.ShapeType.ellipse, {
      x: cx - d / 2,
      y: cy - d / 2,
      w: d,
      h: d,
      fill: { color: color, transparency: 100 },
      line: { color: color, width: 1, transparency: 100 - opacity },
    });
  });
}

/* ---------------- Slide 1 : cover ---------------- */
const s1 = pres.addSlide();
s1.background = { color: NAVY };
nodeRings(s1, 10.7, 3.75, ICE, 42, 1.15);
s1.addShape(pres.ShapeType.ellipse, {
  x: 10.55, y: 3.6, w: 0.3, h: 0.3,
  fill: { color: ICE },
});

s1.addText("Pi Agent 实践小结", {
  x: 0.95, y: 2.55, w: 8.2, h: 1.15,
  margin: 0, valign: "middle",
  fontFace: "Arial", fontSize: 44, bold: true, color: "FFFFFF",
});
s1.addText("yuanshiwen · 2026-11-11", {
  x: 0.98, y: 3.85, w: 8.2, h: 0.5,
  margin: 0, valign: "middle",
  fontFace: "Arial", fontSize: 18, color: ICE,
});

/* ---------------- Slide 2 : content ---------------- */
const s2 = pres.addSlide();
s2.background = { color: "FFFFFF" };
nodeRings(s2, 11.15, 4.35, NAVY, 16, 1);
s2.addShape(pres.ShapeType.ellipse, {
  x: 10.93, y: 4.13, w: 0.44, h: 0.44,
  fill: { color: NAVY },
});

s2.addText("六项任务要点", {
  x: 0.9, y: 0.62, w: 8.6, h: 0.9,
  margin: 0,
  fontFace: "Arial", fontSize: 38, bold: true, color: NAVY,
});

s2.addShape(pres.ShapeType.roundRect, {
  x: 0.9, y: 1.9, w: 8.0, h: 4.9,
  rectRadius: 0.12,
  fill: { color: PANEL },
  line: { color: PANEL, width: 0 },
});

const items = [
  "安装与启动",
  "模型与思考级别切换",
  "@ 引用代码文件",
  "粘贴图片输入",
  "插件 pi-web-access 安装与调用",
  "PPT Skill 安装与调用",
];

s2.addText(
  items.map((t, i) => ({
    text: t,
    options: {
      bullet: { code: "25CF" },
      breakLine: i !== items.length - 1,
    },
  })),
  {
    x: 1.42, y: 1.95, w: 7.0, h: 4.8,
    margin: 0, valign: "middle",
    fontFace: "Arial", fontSize: 20, color: BODY,
    paraSpaceAfter: 24,
  }
);

const outDir = path.join(__dirname, "..", "github-submit", "practice-01", "out");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "pi-practice.pptx");

pres.writeFile({ fileName: outFile }).then(() => {
  const kb = (fs.statSync(outFile).size / 1024).toFixed(1);
  console.log("written:", outFile, kb + " KB");
});
