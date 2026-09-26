# 学生请销假系统 · 前端

学生请销假系统的前端工程：Vue 3 + Vite 单页应用，按角色展示请假、审批、销假、统计与用户管理界面。

- 仓库：`git@github.com:yinying8761/Student-Leave-Request-System-frontend.git`
- 后端仓库：`Student-Leave-Request-System-backend`（Spring Boot，默认 `http://localhost:8080`）
- 开发端口：`5173`，访问 http://localhost:5173

---

## 一、技术栈

| 分类 | 选型 |
| --- | --- |
| 框架 | Vue 3.5（`<script setup>` 单文件组件） |
| 构建 | Vite 8 + `@vitejs/plugin-vue` |
| UI | Element Plus 2.14（全局注册，中文语言包 zh-cn）+ `@element-plus/icons-vue` |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 4（`createWebHistory`） |
| 请求 | Axios（统一实例 + 请求/响应拦截器） |
| 其他 | `element-china-area-data`（省市区级联）、`@vueuse/core` |

---

## 二、目录结构

```
frontend/
├── index.html
├── vite.config.js            # 开发端口 5173，/api 代理到 localhost:8080
├── public/                   # favicon.svg、icons.svg
└── src/
    ├── main.js               # 挂载 Pinia / Router / Element Plus，全量注册图标
    ├── App.vue               # 整体布局：顶栏 + 侧边菜单 + router-view
    ├── api/                  # 按模块封装的接口方法
    │   ├── auth.js  application.js  approval.js
    │   └── cancellation.js  statistics.js  user.js
    ├── router/index.js       # 路由表 + 全局前置守卫（校验 token）
    ├── stores/user.js        # Pinia 用户状态（token / 角色 / 个人资料）
    ├── utils/request.js      # Axios 实例：注入 token、统一处理 code 与 401
    ├── assets/               # hero.png、vue.svg、vite.svg
    └── views/                # 页面组件
        ├── Login.vue             登录
        ├── Dashboard.vue         工作台
        ├── Applications.vue      我的请假 / 请假列表
        ├── ApplicationCreate.vue 发起请假
        ├── ApplicationDetail.vue 请假详情 + 审批记录
        ├── Approvals.vue         待审批（辅导员）
        ├── Cancellations.vue     销假管理（辅导员）
        ├── ApprovalRecords.vue   审批记录 / 辅导员代销假入口
        ├── Statistics.vue        数据统计
        ├── Users.vue             用户管理（管理员）
        └── Profile.vue           个人信息与修改密码
```

---

## 三、环境要求

- Node.js 18+（[nodejs.org](https://nodejs.org/)）
- 可访问的后端服务（默认 `http://localhost:8080`）与已初始化的 `leave_system` 数据库
---

## 四、快速开始

```bash
npm install
npm run dev          # 开发服务器 http://localhost:5173
npm run build        # 产物输出到 dist/
npm run preview      # 本地预览构建产物
```

开发环境下所有 `/api` 请求由 Vite 代理到后端，无需处理跨域：

```js
// vite.config.js
server: {
  port: 5173,
  proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } }
}
```

若后端端口或地址有变，同步修改上述 `target`。

### 登录

使用后端已存在的账号登录（数据库初始化后默认管理员：`admin` / `admin123`）；学生、辅导员账号由管理员在「用户管理」中创建。

---

## 五、路由与角色权限

| 路由 | 页面 | 侧边菜单可见角色 |
| --- | --- | --- |
| `/login` | 登录 | 未登录 |
| `/dashboard` | 工作台 | 全部 |
| `/applications` | 我的请假 / 请假列表 | STUDENT |
| `/applications/create` | 发起请假 | STUDENT |
| `/applications/:id` | 请假详情 | 全部（从列表进入） |
| `/approvals` | 待审批 | COUNSELOR |
| `/cancellations` | 销假管理 | COUNSELOR |
| `/approval-records` | 审批记录 / 代销假 | COUNSELOR、ADMIN |
| `/users` | 用户管理 | ADMIN |
| `/profile` | 个人信息 | 全部 |
| `/statistics` | 数据统计 | 未挂菜单，可直接访问 `/statistics` |
| `*` | 兜底 | 重定向到 `/dashboard` |

路由守卫（`src/router/index.js`）仅做一件事：非 `meta.noAuth` 页面且本地无 token 时跳转 `/login`。角色级权限由后端接口校验，前端通过菜单显隐控制入口。

**角色说明**：`STUDENT` 学生、`COUNSELOR` 辅导员、`ADMIN` 管理员；后端表结构中另保留 `ADVISOR`（导师），但已不参与审批流程，前端亦未使用。
---

## 六、请求封装与状态管理

`src/utils/request.js` 是唯一的 Axios 实例：

- `baseURL` 为 `/api`，超时 15 秒；
- 请求拦截器自动附加 `Authorization: Bearer <token>`；
- 响应拦截器约定后端返回体 `{ code, message, data }`：`code === 200` 时直接返回整个响应对象（业务代码使用 `res.data`），否则 `ElMessage.error` 提示并 reject；
- HTTP 401 时清空本地登录态并跳转 `/login`。

`src/stores/user.js`（Pinia）保存 `token`、`id`、`username`、`realName`、`role`、联系方式、院系班级与所属辅导员，并提供 `roleLabel` 中文角色名；`token` 持久化在 `localStorage`。

接口方法集中在 `src/api/` 下，页面也可直接调用 `request`（如 `Profile.vue`、`Users.vue`）。

---

## 七、页面功能

| 页面 | 主要功能 | 调用的接口 |
| --- | --- | --- |
| `Login.vue` | 账号密码登录，保存 token 与用户信息后进入工作台 | `POST /api/auth/login` |
| `Dashboard.vue` | 工作台卡片：待审批数、总申请数、当前角色 | `GET /api/statistics/dashboard` |
| `Applications.vue` | 分页查看本人/名下请假；学生可撤销待审批申请、发起销假 | `GET /api/applications`、`POST /api/cancellations` |
| `ApplicationCreate.vue` | 发起请假：类型、起止时间、原因、是否离校、省市区级联与详细地址、本人电话、紧急联系人（含手机号正则校验） | `POST /api/applications` |
| `ApplicationDetail.vue` | 请假详情与审批记录 | `GET /api/applications/{id}` |
| `Approvals.vue` | 辅导员审批待办：通过 / 驳回并填写意见 | `GET /api/approvals/pending`、`POST /api/approvals` |
| `Cancellations.vue` | 辅导员处理待办销假 | `GET /api/cancellations/pending`、`PUT /api/cancellations/{id}/approve` |
| `ApprovalRecords.vue` | 查看请假记录，辅导员可代为销假 | `GET /api/applications`、`POST /api/cancellations/counselor` |
| `Statistics.vue` | 班级请假次数与累计天数表格 | `GET /api/statistics/class` |
| `Users.vue` | 管理员维护用户（新增 / 编辑 / 删除，为学生指定辅导员） | `GET/POST/PUT/DELETE /api/users` |
| `Profile.vue` | 查看与修改个人资料、修改密码（成功后需重新登录） | `GET /api/users/counselors`、`PUT /api/users/profile`、`PUT /api/users/password` |
---

## 八、已知问题与待办

- 刷新页面后 `token` 仍在但内存中的用户信息会丢失，侧栏虽可见却处于「无账户信息」状态；建议在应用启动时用 `GET /api/auth/me` 恢复用户资料。
- 销假流程与页面仍在完善中。
- 头像上传与展示尚未实现。
- 「请假实时状态（在校 / 离校）」与「审批记录」的展示仍待补充。
- `GET /api/approvals/history` 已在 `api/approval.js` 中声明，但后端尚未实现该接口，暂未在页面中调用。
- `/statistics` 未挂到侧边菜单，需要手动输入地址访问。
- 项目尚未接入 ESLint / Prettier 与单元测试。

---

## 九、常见问题

**Q：`npm install` 太慢或失败？**
A：切换镜像后重试：`npm config set registry https://registry.npmmirror.com`。

**Q：页面接口全部 401 / 报网络错误？**
A：确认后端已在 `8080` 端口启动、数据库已初始化，并且 `vite.config.js` 的代理目标与后端端口一致。

**Q：5173 端口被占用？**
A：修改 `vite.config.js` 中的 `server.port`（后端端口在 `application.yml` 的 `server.port`）。

**Q：登录成功但接口仍然 403？**
A：403 通常来自后端角色校验，请确认当前账号角色与所访问页面的要求一致（例如审批仅辅导员可用）。

---

## 十、开发约定

- 页面组件统一放在 `src/views/`，接口调用优先放在 `src/api/` 中，复杂页面可使用 `request` 直连。
- UI 使用 Element Plus 组件与全局注册的图标，文案为中文。
- 新增页面后需在 `src/router/index.js` 注册路由，并在 `App.vue` 侧边菜单中按角色添加菜单项。