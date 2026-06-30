# Day4 证据卡：发布表单与数据新增

## 一、今日任务总结

Day4 的核心任务是将项目从"只能查看信息"推进到"可以发布信息"的阶段。通过设计发布表单、实现表单校验、使用 Axios 向 JSON Server 提交新增数据，最终实现四类业务（二手交易、失物招领、拼单搭子、跑腿委托）的完整发布流程。

## 二、发布表单设计思路

### 表单字段设计

根据四类业务的特性，我设计了以下表单字段：

**通用字段（所有类型都需要）：**
- 标题（必填）：简洁明了描述发布内容
- 校区（必填）：狮子山校区 / 成龙校区
- 地点（必填）：具体交易或见面地点
- 详细描述（必填）：让其他同学更了解详情

**二手交易专属字段：**
- 价格（必填）：商品定价
- 成色（必填）：全新 / 九成新 / 八成新等

**失物招领专属字段：**
- 类型：寻物启事 / 失物招领
- 物品特征：描述物品的显著特征
- 时间：丢失或拾获时间

**拼单搭子专属字段：**
- 目标人数：拼单需要的人数
- 截止时间：拼单截止时间

**跑腿委托专属字段：**
- 酬劳（必填）：任务报酬金额
- 任务地点：任务执行地点
- 期望完成时间：任务截止时间

### 字段设计理由

每个字段都有其存在的必要性：
- **标题**：用户快速识别信息内容
- **校区 + 地点**：方便同城/同校交易
- **价格/酬劳**：明确交易条件
- **成色/物品特征**：提供商品详情，增加可信度
- **时间字段**：设置交易/拼单/任务的有效期

## 三、表单校验规则设计

### 基础校验

```typescript
const validateForm = () => {
  // 1. 标题必填
  if (!form.title.trim()) {
    ElMessage.warning('请填写标题')
    return false
  }
  // 2. 地点必填
  if (!form.location.trim()) {
    ElMessage.warning('请填写地点')
    return false
  }
  // 3. 描述必填
  if (!form.description.trim()) {
    ElMessage.warning('请填写详细描述')
    return false
  }
  // 4. 二手交易价格必填
  if (form.type === 'secondhand' && !form.price) {
    ElMessage.warning('请填写价格')
    return false
  }
  // 5. 跑腿委托酬劳必填
  if (form.type === 'errand' && !form.reward) {
    ElMessage.warning('请填写酬劳')
    return false
  }
  return true
}
```

### 校验设计理由

- **必填校验**：标题、地点、描述是最基础的信息，缺失则无法展示
- **类型校验**：价格和酬劳是交易类信息的核心字段
- **简单原则**：Day4 阶段不追求复杂的正则校验，基础判断足够

## 四、AI 协作记录

### AI 帮助完成的内容

在 Day4 开发过程中，AI 帮助我完成了以下工作：

1. **API 新增方法模板**：生成了 `createTrade`、`createLostFound`、`createGroupBuy`、`createErrand` 的基础结构
2. **表单校验函数模板**：提供了基础校验函数的写法参考
3. **表单组件代码参考**：生成了 FormField.vue 组件的结构

### 人工调整内容

AI 生成的代码存在以下问题，我进行了修改：

1. **API 路径错误**：AI 生成的路径有时不匹配 db.json 的数据集合名称，修改为正确的路径（trades、lostFounds、groupBuys、errands）
2. **类型定义不完整**：AI 生成的 `CreateTradeData` 等类型缺少必要字段，根据 db.json 补充完整
3. **校验逻辑简化**：AI 生成的校验过于复杂，根据 Day4 实际需求简化为基础判断
4. **字段值不匹配**：AI 生成的校区选项值（如 "shizi"）与 db.json 中的值（如 "狮子山校区"）不一致，手动修改统一

## 五、数据新增流程实现

### API 调用流程

```
用户填写表单 → validateForm() 校验 → submitPublish() 提交
    ↓
根据 type 调用对应 API：
  secondhand → createTrade()
  lost       → createLostFound()
  group      → createGroupBuy()
  errand     → createErrand()
    ↓
JSON Server 返回 201 成功
    ↓
跳转到对应列表页
```

### 关键代码

```typescript
const submitPublish = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    if (form.type === 'secondhand') {
      const data: CreateTradeData = {
        title: form.title,
        price: Number(form.price),
        originalPrice: Number(form.price) * 1.5,
        category: 'other',
        categoryName: '其他',
        condition: form.condition,
        campus: form.campus,
        location: form.location,
        image: 'https://picsum.photos/seed/new/400/400',
        description: form.description,
      }
      await createTrade(data)
    }
    // ... 其他类型类似
    ElMessage.success('发布成功！')
    router.push(getRedirectRoute())
  } catch (error) {
    ElMessage.error('发布失败，请检查 Mock 服务是否启动')
  } finally {
    loading.value = false
  }
}
```

## 六、真实测试记录

### 测试流程

1. **启动 Mock 服务**：`pnpm run mock`
2. **启动前端服务**：`pnpm run dev`
3. **访问发布页面**：http://localhost:5173/publish
4. **选择发布类型**：二手交易
5. **填写表单**：
   - 标题：测试商品
   - 价格：99
   - 成色：九成新
   - 校区：狮子山校区
   - 地点：图书馆门口
   - 描述：这是一条测试数据
6. **点击发布**：按钮显示 loading 状态
7. **查看结果**：
   - 页面跳转到 /trade
   - 二手交易列表显示新增的商品
   - db.json 中 trades 数组末尾新增了一条记录

### 测试结论

发布功能正常工作，数据成功写入 db.json，列表页能够展示新增数据。

## 七、交互反馈设计

### 成功反馈

- 点击发布后按钮显示 loading 状态，防止重复提交
- 发布成功后显示 `ElMessage.success('发布成功！')`
- 1 秒后自动跳转到对应列表页

### 失败反馈

- 校验失败显示 `ElMessage.warning()` 提示具体原因
- API 调用失败显示 `ElMessage.error('发布失败，请检查 Mock 服务是否启动')`
- 控制台输出错误信息便于调试

### 加载状态

- 使用 Element Plus 的 `loading` 属性
- 发布过程中按钮不可点击

## 八、今日收获

通过 Day4 的学习和实践，我深入理解了：

1. **表单设计的业务思维**：不是简单堆输入框，而是围绕业务场景设计必要字段
2. **表单校验的重要性**：前端校验可以提前发现错误，减少无效请求
3. **数据新增的完整流程**：表单数据 → 校验 → API 调用 → 结果反馈 → 页面跳转
4. **与后端的数据约定**：前端提交的数据字段必须与 db.json 中的字段一致
5. **用户反馈的必要性**：loading 状态、成功/失败提示可以大大提升用户体验

Day4 完成了"数据展示"到"用户交互"的跨越，为后续 Day5 的用户状态管理、我的发布记录等功能奠定了基础。
