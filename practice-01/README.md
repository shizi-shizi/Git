# 实践课1：Pi Agent 安装与使用

- 姓名拼音：yuanshiwen
- 完成日期：2026-11-11
- 平台：Windows 11 + Windows Terminal + PowerShell 7
- Pi 版本：`1.5.2`（`pi --version`）
- 模型提供商：DeepSeek（API Key 方式配置），可用模型 `deepseek-v4-pro`、`deepseek-flash`

本文档记录本次实践的实际操作过程与截图证据。所有截图都是在真实 Pi 会话中直接对窗口截取的，未做内容修改；不含 API Key、`auth.json`、授权回调链接等敏感信息。

## 目录

- `screenshots/`：S1–S8 验收截图
- `files/hello.py`：任务四 A 用到的代码文件
- `files/paste-image-test.png`：任务四 B 用到的小图片（200×200，浅蓝色方块 + 白色数字 7）
- `pptx/`：任务六从 anthropics/skills 下载的 `skills/pptx` 完整副本（含 `SKILL.md`、`LICENSE.txt`、`scripts/`，源 commit `2c5958ecac7cee2b583967a2c4981d0f4a75c579`）

---

## 任务一 本地安装并启动

安装命令（官方 README 提供的 Windows 入口）：

```powershell
powershell -c "irm https://pi.dev/install.ps1 | iex"
```

安装后关闭旧终端，在专用练习目录中启动：

```powershell
mkdir pi-test
cd pi-test
pi
```

**S1-startup.png**：同屏可见

- 顶部：Pi `v1.5.2`，以及 `escape interrupt / / commands / ! bash / ctrl+o more` 快捷键提示；
- 中部：`[Extensions]` 已加载资源；
- 底部状态栏左侧：当前工作目录 `D:\CodexProject\软件工程概论\Pi agent\pi-test`；
- 底部状态栏右侧：当前模型 `deepseek-v4-pro · high`。

### 一处环境修复记录

Pi 在 Windows 上执行 `!` 开头的 bash 命令时会按固定位置查找 Git Bash（`C:\Program Files\Git\bin\bash.exe`、`C:\Program Files (x86)\Git\bin\bash.exe`）。本机 Git 安装在其他盘，导致最初 `!pwd` 报 `No bash shell found`。

按报错提示的第 3 种方式，在全局设置 `C:\Users\6\.pi\agent\settings.json` 中显式指定 shell：

```json
{
  "shellPath": "D:\\Git\\Git\\bin\\bash.exe"
}
```

修复后 Pi 的 bash 工具与 `!` 命令均可用，任务四 A 的截图中可以看到 `$ ls -la` 正常执行。

## 任务二 配置模型并完成一次会话

通过 `/login` → `Sign in with an API key` → 选择 DeepSeek，填入在 DeepSeek API Platform 创建的密钥。截图不包含密钥创建过程与密钥本身。

**S2-session.png**：显示自己发出的提示词「你好，请用一句话介绍你自己。」、模型实际回复，以及底部状态栏中的当前模型 `deepseek-v4-pro · high` 与目录信息。

## 任务三 切换模型与模型思考级别

切换方式：`/model` 打开模型选择器，在候选中筛选 `flash` 后回车确认；随后 `/thinking` 选择思考级别。

| 截图 | 状态 | 说明 |
| --- | --- | --- |
| `S3-model-before.png` | `deepseek-v4-pro · high` | 切换前的模型与思考级别（同一会话中的“你好”一轮） |
| `S3-model-after.png` | `deepseek-flash · high` | 用 `/model` 切换到 DeepSeek V4.1 Flash 后提问「请用一句话解释持续集成。」，回复正常；界面出现 `Model: deepseek-flash` 系统提示行 |
| `S3-thinking-after.png` | `deepseek-flash · low` | 用 `/thinking` 把思考级别从 `high` 改为 `low`，界面出现 `Thinking level: low`，再次提问「请用一句话说明代码评审的作用。」，回复正常 |

思考级别选择器中该模型提供 `off / low（~2k tokens）/ high（~16k tokens）/ max`，本次实际选择 `low`。

选择依据：`deepseek-v4-pro` 思考级别只支持 `high` 与 `max`，适合复杂推理；`deepseek-flash` 支持 `low/high/max`，价格更低（$0.3/$1.2 每百万 token，pro 为 $1.32/$3.96），适合解释性问答、文件说明、Skill 调用等不需要深度推理的任务。日常小任务用 flash + low 更快更省；只有遇到跨文件重构、复杂推理才切到 pro + high。

## 任务四 引用代码并粘贴小图片

### A 使用 @ 引用代码文件

`files/hello.py`（运行输出 `5`）：

```python
def add(a, b):
    return a + b

print(add(2, 3))
```

在 `pi-test` 目录启动 Pi，输入 `@` 打开候选列表，继续输入 `hello` 过滤，选中 `hello.py` 后回车确认，再输入提示词「…的功能，说明运行后输出什么。只解释，不修改文件。」

**S4-file-reference.png**：可见引用后的 `@hello.py`、完整问题、Pi 自己的工具调用（`$ ls -la`、`read hello.py`）以及回复「hello.py 定义了一个加法函数 add(a, b)…运行后输出 5」，并注明文件未被修改。

### B 粘贴小图片

图片为 200×200 的浅蓝色方块，中央白色数字 7（`files/paste-image-test.png`）。先把图片放入剪贴板（图像格式，不是文件路径），在 Pi 输入区按 `Alt+V` 粘贴，Pi 将其落盘为临时图片文件并在输入框中显示该路径，随后追问「请描述图片中的颜色、形状和数字。」

**S5-image-input.png**：可见粘贴产生的图片路径、问题、`read` 工具对该图片的读取，以及回复「浅蓝色（青色系）背景方块…白色数字 7，位于浅蓝色方块正中央」。

## 任务五 安装并使用一个插件

- 名称：`pi-web-access`（npm 包 `pi-web-access@0.47.0`）
- 来源：https://pi.dev/packages 收录的 Pi Package，仓库 https://github.com/nicobailon/pi-web-access ，作者 Nico Bailon，MIT
- 作用：为 Pi 增加联网能力——网页搜索、URL 抓取、GitHub 仓库/Issue 读取、PDF 提取、YouTube 视频理解等
- 安装命令（本次为项目级安装，装在 `pi-test`）：

```powershell
pi install npm:pi-web-access -l
```

为了拿到真实的安装输出，先执行 `pi remove npm:pi-web-access -l` 移除旧安装，再重新安装。

**S6-install.png**：`Removing npm:pi-web-access...` → `removed 211 packages in 3s` → `Removed npm:pi-web-access`，随后 `Installing npm:pi-web-access...` → `added 211 packages in 24s` → `Installed npm:pi-web-access`。

**S6-extension-loaded.png**：完全退出原会话后单独运行 `pi`，启动画面的 `[Extensions]` 区域列出 `pi-web-access:dist`（该扩展的入口在包内 `dist` 目录）。

**S6-tool-use.png**：实际调用一次功能，提示词「请用 web_search 搜索 Pi coding agent 的官方文档，告诉我前三条结果的标题和链接。」，可见扩展工具 `search` 发起 3 条查询、15 个来源（provider: exa），并给出 pi.dev 文档 / Quickstart / Command Line 三个结果链接。

需要说明的限制：该包的网页搜索（`search`/`web_search`）可用；网页正文抓取（fetch）在本机被包内自带的 SSRF 防护拦截，因此抓取路径没有验证成功。按作业要求，没有通过关闭或绕过安全防护来“完成”抓取测试。

## 任务六 让 AI 安装一个 PPT Skill（选做，已完成）

- 来源：https://github.com/anthropics/skills 的 `skills/pptx`
- 源 commit：`2c5958ecac7cee2b583967a2c4981d0f4a75c579`（记录在 `.pi/skills/pptx/SOURCE_COMMIT.txt`）
- 安装位置：`D:\CodexProject\软件工程概论\Pi agent\.pi\skills\pptx`
- 内容：`SKILL.md`、`LICENSE.txt`、`SOURCE_COMMIT.txt`、`scripts/`（`add_slide.py`、`clean.py`、`thumbnail.py`、`office/` 下的校验脚本与 OOXML schemas）

**S7-skill-files.png**：终端中 `Get-Location` 显示项目根目录 `D:\CodexProject\软件工程概论\Pi agent`，其下列出 `.pi\skills\pptx\SKILL.md`、`.pi\skills\pptx\LICENSE.txt`、`.pi\skills\pptx\scripts\...`，路径与文件均可辨认。完整副本另存于本仓库 `pptx/` 目录。

### 启动发现与实际调用

**S8-skill-discovered.png**：在该项目目录重新启动 `pi`，启动画面 `[Skills]` 区域列出 `pptx`，底部状态栏显示工作目录 `D:\CodexProject\软件工程概论\Pi agent` 与当前模型 `deepseek-flash · high`。

**S8-skill-invoked.png**：输入 `/skill:pptx 请说明这个 Skill 的名称、用途和所在目录。`，界面出现 `[skill] pptx` 标记，回复给出：

- 名称：`pptx`
- 所在目录：`D:\CodexProject\软件工程概论\Pi agent\.pi\skills\pptx`（主文件为其中的 `SKILL.md`）
- 用途：处理 `.pptx/.potx` 演示文稿的各类任务，并列出了新建（pptxgenjs 脚本）、编辑（解压改 XML 再打包）、读取（markdown / `thumbnail.py` 缩略图）等场景与 `scripts/` 中的脚本清单

按作业的四层划分：安装成功、发现成功、调用成功均已达成并留下截图；生成 PPT 属于选做之外的延伸项，本次未生成实际演示文件。

## 备用说明

- 所有截图均为 Pi 在 Windows Terminal 中的真实窗口截图，未拼接、未改动内容。
- 截图中出现的临时图片路径（`C:\Users\6\AppData\Local\Temp\pi-clipboard-*.png`）是 `Alt+V` 粘贴时 Pi 自动落盘的位置，属于正常行为。
- 未提交 `auth.json`、API Key、授权回调或其他凭据。
