<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import FormField from '../components/FormField.vue'
import { createTrade, type CreateTradeData } from '../api/trade'
import { createLostFound, type CreateLostFoundData } from '../api/lostFound'
import { createGroupBuy, type CreateGroupBuyData } from '../api/groupBuy'
import { createErrand, type CreateErrandData } from '../api/errand'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive({
  type: 'secondhand',
  title: '',
  campus: '狮子山校区',
  location: '',
  description: '',
  price: '',
  condition: '九成新',
  lostOrFound: 'lost',
  eventTime: '',
  itemFeature: '',
  targetCount: 3,
  currentCount: 1,
  deadline: '',
  reward: '',
  taskPlace: '',
  expectedTime: '',
})

const typeOptions = [
  { value: 'secondhand', label: '二手交易', color: '#409eff', icon: 'ShoppingCart', route: '/trade' },
  { value: 'lost', label: '失物招领', color: '#e6a23c', icon: 'Search', route: '/lost-found' },
  { value: 'group', label: '拼单搭子', color: '#67c23a', icon: 'UserPlus', route: '/group-buy' },
  { value: 'errand', label: '跑腿委托', color: '#f56c6c', icon: 'Van', route: '/errand' },
]

const campusOptions = [
  { value: '狮子山校区', label: '狮子山校区' },
  { value: '成龙校区', label: '成龙校区' },
]

const conditionOptions = [
  { value: '全新', label: '全新' },
  { value: '九成新', label: '九成新' },
  { value: '八成新', label: '八成新' },
  { value: '七成新', label: '七成新' },
  { value: '有瑕疵', label: '有瑕疵' },
]

const inputTag = ref('')
const dynamicTags = ref<string[]>([])
const imageList = ref<{ id: number; url: string }[]>([])

const handleInputConfirm = () => {
  if (inputTag.value && dynamicTags.value.indexOf(inputTag.value) === -1) {
    dynamicTags.value.push(inputTag.value)
  }
  inputTag.value = ''
}

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const removeImage = (id: number) => {
  imageList.value = imageList.value.filter(img => img.id !== id)
}

const validateForm = () => {
  if (!form.title.trim()) {
    ElMessage.warning('请填写标题')
    return false
  }
  if (!form.location.trim()) {
    ElMessage.warning('请填写地点')
    return false
  }
  if (!form.description.trim()) {
    ElMessage.warning('请填写详细描述')
    return false
  }
  if (form.type === 'secondhand' && !form.price) {
    ElMessage.warning('请填写价格')
    return false
  }
  if (form.type === 'errand' && !form.reward) {
    ElMessage.warning('请填写酬劳')
    return false
  }
  return true
}

const getRedirectRoute = () => {
  const typeOption = typeOptions.find(t => t.value === form.type)
  return typeOption?.route || '/'
}

const submitPublish = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')

    if (form.type === 'secondhand') {
      const data: CreateTradeData & { publisher: string; publisherAvatar: string; publishTime: string; status: string; viewCount: number; favoriteCount: number } = {
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
        publisher: userStore.nickname,
        publisherAvatar: userStore.avatar,
        publishTime: now,
        status: 'open',
        viewCount: 0,
        favoriteCount: 0,
      }
      await createTrade(data)
    } else if (form.type === 'lost') {
      const data: CreateLostFoundData & { publisher: string; publisherAvatar: string; status: string } = {
        title: form.title,
        type: form.lostOrFound,
        typeName: form.lostOrFound === 'lost' ? '寻物启事' : '失物招领',
        itemName: form.itemFeature || '未填写',
        location: form.location,
        time: form.eventTime ? new Date(form.eventTime).toISOString() : now,
        contact: '请站内联系',
        campus: form.campus,
        image: 'https://picsum.photos/seed/new/400/300',
        description: form.description,
        publisher: userStore.nickname,
        publisherAvatar: userStore.avatar,
        status: 'open',
      }
      await createLostFound(data)
    } else if (form.type === 'group') {
      const data: CreateGroupBuyData & { publisher: string; publisherAvatar: string; publishTime: string; status: string; currentPeople: number } = {
        title: form.title,
        type: 'other',
        typeName: '其他',
        description: form.description,
        totalPeople: form.targetCount,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : now,
        location: form.campus,
        image: 'https://picsum.photos/seed/new/400/300',
        publisher: userStore.nickname,
        publisherAvatar: userStore.avatar,
        publishTime: now,
        status: 'open',
        currentPeople: 1,
      }
      await createGroupBuy(data)
    } else if (form.type === 'errand') {
      const data: CreateErrandData & { publisher: string; publisherAvatar: string; publishTime: string; status: string } = {
        title: form.title,
        type: 'other',
        typeName: '其他',
        description: form.description,
        reward: Number(form.reward),
        pickupLocation: form.taskPlace || form.location,
        deliveryLocation: form.location,
        deadline: form.expectedTime ? new Date(form.expectedTime).toISOString() : now,
        campus: form.campus,
        image: 'https://picsum.photos/seed/new/400/300',
        publisher: userStore.nickname,
        publisherAvatar: userStore.avatar,
        publishTime: now,
        status: 'open',
      }
      await createErrand(data)
    }

    ElMessage.success('发布成功！')
    setTimeout(() => {
      router.push(getRedirectRoute())
    }, 1000)
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败，请检查 Mock 服务是否启动')
  } finally {
    loading.value = false
  }
}

const saveDraft = () => {
  ElMessage.info('草稿已保存')
}

const currentType = computed(() => typeOptions.find(t => t.value === form.type))
</script>

<template>
  <div class="publish-page">
    <h2 class="page-title">发布信息</h2>

    <div class="publish-container">
      <div class="form-section">
        <el-card shadow="never" class="form-card">
          <div class="form-row">
            <div class="form-label">信息类型</div>
            <div class="type-selector">
              <div
                v-for="opt in typeOptions"
                :key="opt.value"
                :class="['type-card', { active: form.type === opt.value }]"
                :style="{ borderColor: form.type === opt.value ? opt.color : '' }"
                @click="form.type = opt.value"
              >
                <span class="type-dot" :style="{ background: opt.color }"></span>
                <span>{{ opt.label }}</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-label">上传图片</div>
            <div class="image-upload">
              <div v-for="img in imageList" :key="img.id" class="uploaded-image">
                <el-image :src="img.url" fit="cover" />
                <div class="image-actions">
                  <el-button size="small" circle @click="removeImage(img.id)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="upload-trigger">
                <el-icon :size="32"><Plus /></el-icon>
                <span>添加图片</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-label">标题</div>
            <el-input
              v-model="form.title"
              placeholder="请输入标题，简洁明了描述您的信息"
              maxlength="50"
              show-word-limit
            />
          </div>

          <div class="form-row">
            <div class="form-label">校区与地点</div>
            <div class="location-row">
              <el-select v-model="form.campus" style="width: 160px">
                <el-option
                  v-for="camp in campusOptions"
                  :key="camp.value"
                  :label="camp.label"
                  :value="camp.value"
                />
              </el-select>
              <el-input v-model="form.location" placeholder="具体地点，如：图书馆、食堂等" />
            </div>
          </div>

          <template v-if="form.type === 'secondhand'">
            <div class="form-row">
              <div class="form-label">价格</div>
              <el-input v-model="form.price" placeholder="请输入价格" style="width: 200px">
                <template #prefix>¥</template>
              </el-input>
            </div>
            <div class="form-row">
              <div class="form-label">成色</div>
              <el-select v-model="form.condition" style="width: 200px">
                <el-option
                  v-for="c in conditionOptions"
                  :key="c.value"
                  :label="c.label"
                  :value="c.value"
                />
              </el-select>
            </div>
          </template>

          <template v-if="form.type === 'lost'">
            <div class="form-row">
              <div class="form-label">类型</div>
              <el-radio-group v-model="form.lostOrFound">
                <el-radio value="lost">寻物启事</el-radio>
                <el-radio value="found">失物招领</el-radio>
              </el-radio-group>
            </div>
            <div class="form-row">
              <div class="form-label">{{ form.lostOrFound === 'lost' ? '丢失时间' : '拾获时间' }}</div>
              <el-date-picker
                v-model="form.eventTime"
                type="datetime"
                placeholder="选择时间"
                style="width: 280px"
              />
            </div>
            <div class="form-row">
              <div class="form-label">物品特征</div>
              <el-input
                v-model="form.itemFeature"
                placeholder="描述物品的显著特征，方便确认"
                type="textarea"
                :rows="3"
              />
            </div>
          </template>

          <template v-if="form.type === 'group'">
            <div class="form-row">
              <div class="form-label">人数</div>
              <div class="count-row">
                <el-input-number v-model="form.currentCount" :min="1" :max="form.targetCount" />
                <span style="margin: 0 8px; color: #606266">/</span>
                <el-input-number v-model="form.targetCount" :min="2" :max="50" />
                <span style="margin-left: 8px; color: #909399">人</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-label">截止时间</div>
              <el-date-picker
                v-model="form.deadline"
                type="datetime"
                placeholder="选择截止时间"
                style="width: 280px"
              />
            </div>
          </template>

          <template v-if="form.type === 'errand'">
            <div class="form-row">
              <div class="form-label">酬劳</div>
              <el-input v-model="form.reward" placeholder="请输入酬劳金额" style="width: 200px">
                <template #prefix>¥</template>
              </el-input>
            </div>
            <div class="form-row">
              <div class="form-label">任务地点</div>
              <el-input v-model="form.taskPlace" placeholder="任务执行的具体地点" />
            </div>
            <div class="form-row">
              <div class="form-label">期望完成时间</div>
              <el-date-picker
                v-model="form.expectedTime"
                type="datetime"
                placeholder="选择期望完成时间"
                style="width: 280px"
              />
            </div>
          </template>

          <div class="form-row">
            <div class="form-label">详细描述</div>
            <el-input
              v-model="form.description"
              placeholder="详细描述您的信息，让其他同学更了解详情"
              type="textarea"
              :rows="6"
              maxlength="500"
              show-word-limit
            />
          </div>

          <div class="form-row">
            <div class="form-label">标签</div>
            <div class="tags-input">
              <el-tag
                v-for="tag in dynamicTags"
                :key="tag"
                closable
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="dynamicTags.length < 5"
                v-model="inputTag"
                size="small"
                class="tag-input"
                placeholder="添加标签"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
            </div>
          </div>

          <div class="form-actions">
            <el-button size="large" @click="saveDraft">保存草稿</el-button>
            <el-button type="primary" size="large" :loading="loading" @click="submitPublish">
              立即发布
            </el-button>
          </div>
        </el-card>
      </div>

      <div class="sidebar-section">
        <el-card shadow="never" class="tip-card">
          <template #header>
            <div class="tip-header">
              <el-icon color="#409eff"><InfoFilled /></el-icon>
              <span>发布须知</span>
            </div>
          </template>
          <div class="tip-list">
            <div class="tip-item">
              <el-icon color="#409eff"><CircleCheck /></el-icon>
              <span>请如实填写信息，确保真实有效</span>
            </div>
            <div class="tip-item">
              <el-icon color="#409eff"><CircleCheck /></el-icon>
              <span>清晰的图片能提高信息关注度</span>
            </div>
            <div class="tip-item">
              <el-icon color="#409eff"><CircleCheck /></el-icon>
              <span>添加合适的标签便于他人搜索</span>
            </div>
            <div class="tip-item">
              <el-icon color="#409eff"><CircleCheck /></el-icon>
              <span>交易请选择公共安全场所</span>
            </div>
            <div class="tip-item">
              <el-icon color="#409eff"><CircleCheck /></el-icon>
              <span>保护个人隐私，谨慎透露联系方式</span>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="preview-card">
          <template #header>
            <div class="preview-header">
              <el-icon color="#409eff"><View /></el-icon>
              <span>预览效果</span>
            </div>
          </template>
          <div class="preview-content">
            <el-image 
              :src="imageList[0]?.url || 'https://picsum.photos/seed/placeholder/400/300'" 
              fit="cover"
              class="preview-image"
            />
            <div class="preview-info">
              <el-tag v-if="currentType" :color="currentType.color" effect="dark" size="small">
                {{ currentType.label }}
              </el-tag>
              <p class="preview-title">{{ form.title || '标题将在此处显示' }}</p>
              <p class="preview-location">{{ form.campus }} · {{ form.location || '地点' }}</p>
              <p v-if="form.price" class="preview-price">¥{{ form.price }}</p>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="warning-card">
          <template #header>
            <div class="warning-header">
              <el-icon color="#e6a23c"><Warning /></el-icon>
              <span>安全提醒</span>
            </div>
          </template>
          <p>校园轻集市仅提供信息发布平台，请同学们在交易或见面时注意人身和财产安全。</p>
          <p>如遇违规信息，可点击详情页举报按钮。</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.publish-page {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 20px;
  color: #303133;
  margin: 0 0 20px 0;
}

.publish-container {
  display: flex;
  gap: 24px;
}

.form-section {
  flex: 1;
  min-width: 0;
}

.form-card {
  border-radius: 12px;
  padding: 24px;
}

.form-row {
  margin-bottom: 24px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
}

.type-selector {
  display: flex;
  gap: 12px;
}

.type-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #606266;
}

.type-card:hover {
  border-color: #409eff;
  color: #409eff;
}

.type-card.active {
  background: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

.type-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.image-upload {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.uploaded-image {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-image .el-image {
  width: 100%;
  height: 100%;
}

.image-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.uploaded-image:hover .image-actions {
  opacity: 1;
}

.upload-trigger {
  width: 120px;
  height: 120px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  color: #909399;
  transition: all 0.2s;
}

.upload-trigger:hover {
  border-color: #409eff;
  color: #409eff;
}

.upload-trigger span {
  font-size: 12px;
}

.location-row {
  display: flex;
  gap: 12px;
}

.count-row {
  display: flex;
  align-items: center;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-input {
  width: 100px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

.sidebar-section {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-card,
.warning-card,
.preview-card {
  border-radius: 12px;
}

.tip-header,
.warning-header,
.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #303133;
}

.tip-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.warning-card p {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
  margin: 0 0 8px 0;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-image {
  width: 100%;
  height: 160px;
  border-radius: 8px;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0;
}

.preview-location {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.preview-price {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
  margin: 0;
}
</style>
