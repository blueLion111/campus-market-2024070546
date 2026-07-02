import fs from 'fs';
import path from 'path';

const projectRoot = path.join(path.dirname(import.meta.url).replace('file:///', ''), '..');

const checks = {
  projectStructure: [
    { name: 'src 目录', path: 'src', type: 'dir' },
    { name: 'public 目录', path: 'public', type: 'dir' },
    { name: 'docs 目录', path: 'docs', type: 'dir' },
    { name: 'db.json', path: 'db.json', type: 'file' },
    { name: 'package.json', path: 'package.json', type: 'file' },
    { name: 'README.md', path: 'README.md', type: 'file' },
    { name: 'vite.config.ts', path: 'vite.config.ts', type: 'file' },
    { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file' },
  ],
  corePages: [
    { name: '首页', path: 'src/views/HomeView.vue' },
    { name: '二手交易', path: 'src/views/TradeView.vue' },
    { name: '失物招领', path: 'src/views/LostFoundView.vue' },
    { name: '拼单搭子', path: 'src/views/GroupBuyView.vue' },
    { name: '跑腿委托', path: 'src/views/ErrandView.vue' },
    { name: '发布信息', path: 'src/views/PublishView.vue' },
    { name: '商品详情', path: 'src/views/DetailView.vue' },
    { name: '用户中心', path: 'src/views/UserCenterView.vue' },
    { name: '登录页面', path: 'src/views/LoginView.vue' },
    { name: '注册页面', path: 'src/views/RegisterView.vue' },
    { name: '消息中心', path: 'src/views/MessageView.vue' },
    { name: '公告栏', path: 'src/views/BoardView.vue' },
  ],
  coreComponents: [
    { name: '顶部导航', path: 'src/components/AppHeader.vue' },
    { name: '导航菜单', path: 'src/components/AppNav.vue' },
    { name: '布局容器', path: 'src/components/AppLayout.vue' },
    { name: '商品卡片', path: 'src/components/ItemCard.vue' },
    { name: '空状态', path: 'src/components/EmptyState.vue' },
    { name: '加载状态', path: 'src/components/LoadingState.vue' },
    { name: '错误状态', path: 'src/components/ErrorState.vue' },
    { name: '搜索组件', path: 'src/components/SearchBar.vue' },
  ],
  apiModules: [
    { name: 'HTTP 封装', path: 'src/api/http.ts' },
    { name: '二手交易 API', path: 'src/api/trade.ts' },
    { name: '失物招领 API', path: 'src/api/lostFound.ts' },
    { name: '拼单搭子 API', path: 'src/api/groupBuy.ts' },
    { name: '跑腿委托 API', path: 'src/api/errand.ts' },
    { name: '用户 API', path: 'src/api/user.ts' },
    { name: '收藏 API', path: 'src/api/favorite.ts' },
  ],
  storeFiles: [
    { name: '用户状态', path: 'src/stores/user.ts' },
    { name: '收藏状态', path: 'src/stores/favorite.ts' },
  ],
  evidenceCards: [
    { name: 'Day1 证据卡', path: 'docs/evidence/Day1_Evidence.md' },
    { name: 'Day2 证据卡', path: 'docs/evidence/Day2_Evidence.md' },
    { name: 'Day3 证据卡', path: 'docs/evidence/Day3_Evidence.md' },
    { name: 'Day4 证据卡', path: 'docs/evidence/Day4_Evidence.md' },
    { name: 'Day5 证据卡', path: 'docs/evidence/Day5_Evidence.md' },
    { name: 'Day6 证据卡', path: 'docs/evidence/Day6_Evidence.md' },
    { name: 'Day7 证据卡', path: 'docs/evidence/Day7_Evidence.md' },
  ],
};

function checkExists(checkItem) {
  const fullPath = path.join(projectRoot, checkItem.path);
  if (checkItem.type === 'dir') {
    try {
      return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
    } catch {
      return false;
    }
  }
  try {
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
  } catch {
    return false;
  }
}

function generateReport() {
  let report = '# 项目检测报告\n\n';
  report += `**检测时间**: ${new Date().toLocaleString('zh-CN')}\n`;
  report += `**项目根目录**: ${projectRoot}\n\n`;

  let totalPass = 0;
  let totalChecks = 0;

  for (const [category, items] of Object.entries(checks)) {
    report += `## ${category}\n\n`;
    report += '| 项目 | 路径 | 状态 |\n';
    report += '|------|------|------|\n';

    items.forEach(item => {
      totalChecks++;
      const exists = checkExists(item);
      if (exists) totalPass++;
      report += `| ${item.name} | \`${item.path}\` | ${exists ? '✅ 通过' : '❌ 缺失'} |\n`;
    });

    report += '\n';
  }

  const dbData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'db.json'), 'utf8'));
  const dbChecks = [
    { name: 'users 数据', exists: !!dbData.users && dbData.users.length > 0 },
    { name: 'trades 数据', exists: !!dbData.trades && dbData.trades.length > 0 },
    { name: 'lostFounds 数据', exists: !!dbData.lostFounds && dbData.lostFounds.length > 0 },
    { name: 'groupBuys 数据', exists: !!dbData.groupBuys && dbData.groupBuys.length > 0 },
    { name: 'errands 数据', exists: !!dbData.errands && dbData.errands.length > 0 },
  ];

  report += '## db.json 数据检查\n\n';
  report += '| 数据集合 | 状态 |\n';
  report += '|----------|------|\n';

  dbChecks.forEach(check => {
    totalChecks++;
    if (check.exists) totalPass++;
    report += `| ${check.name} | ${check.exists ? '✅ 通过' : '❌ 缺失'} |\n`;
  });

  report += '\n';

  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  const scriptChecks = [
    { name: 'dev 脚本', exists: !!packageJson.scripts?.dev },
    { name: 'build 脚本', exists: !!packageJson.scripts?.build },
    { name: 'mock 脚本', exists: !!packageJson.scripts?.mock },
    { name: 'type-check 脚本', exists: !!packageJson.scripts?.['type-check'] },
    { name: 'lint 脚本', exists: !!packageJson.scripts?.lint },
  ];

  report += '## package.json 脚本检查\n\n';
  report += '| 脚本名称 | 状态 |\n';
  report += '|----------|------|\n';

  scriptChecks.forEach(check => {
    totalChecks++;
    if (check.exists) totalPass++;
    report += `| ${check.name} | ${check.exists ? '✅ 通过' : '❌ 缺失'} |\n`;
  });

  report += '\n';

  const passRate = ((totalPass / totalChecks) * 100).toFixed(1);
  report += `## 检测总结\n\n`;
  report += `- **检测项目总数**: ${totalChecks}\n`;
  report += `- **通过项目数**: ${totalPass}\n`;
  report += `- **通过率**: ${passRate}%\n\n`;

  if (totalPass === totalChecks) {
    report += '✅ **所有检测项目均通过！**\n\n';
    report += '项目结构完整，核心文件齐全，可进行最终验收。\n';
  } else {
    report += '❌ **部分检测项目未通过，请检查缺失的文件。**\n';
  }

  return report;
}

const report = generateReport();
const reportPath = path.join(projectRoot, 'CHECK_REPORT.md');
fs.writeFileSync(reportPath, report, 'utf8');

console.log('检测报告已生成:', reportPath);
console.log('\n' + report.split('\n').slice(0, 15).join('\n'));