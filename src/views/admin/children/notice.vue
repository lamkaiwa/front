<template>
  <div id="notice">
    <main>
      <div>
        <el-button type="primary" @click="insertNotice()">+新增</el-button>
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
          <el-form :model="newNotice" label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="newNotice.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="时间">
              <div class="block">
                <el-date-picker v-model="newNotice.date" type="datetime" placeholder="选择日期"> </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="内容">
              <el-input type="textarea" rows="4" v-model="newNotice.content" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="链接">
              <el-input v-model="newNotice.url" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="table">
        <el-table :data="notices" style="width: 100%">
          <el-table-column sortable prop="id" label="id"></el-table-column>
          <el-table-column sortable prop="title" label="标题"></el-table-column>
          <el-table-column label="时间">
            <template slot-scope="scope">
              {{ scope.row.date | fullDateFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
          <el-table-column label="链接">
            <template slot-scope="scope">
              {{ scope.row.url || '无链接' }}
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button @click="editNotice(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteNotice(scope.$index, scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--        分页-->
        <el-pagination
          style="text-align: center;margin: 8px 0"
          background
          :current-page="page"
          layout="prev, pager, next,total"
          :total="count"
          :page-size="pageSize"
          @current-change="handleCurrent"
          hide-on-single-page
        ></el-pagination>
      </div>
    </main>
  </div>
</template>
<script>
import { insertNotice, getNoticeCount, deleteNotice, getNotices, updateNotice } from '../../../api/user'
export default {
  name: 'Notice',
  data() {
    return {
      keyWords: '',
      notices: [],
      newNotice: {
        title: '',
        date: '',
        content: '',
        url: ''
      },
      title: '',
      dialogFormVisible: false,
      page: 1,
      count: 0,
      pageSize: 10
    }
  },
  methods: {
    insertNotice() {
      this.newNotice = {}
      this.dialogFormVisible = true
      this.title = '新增'
    },
    async submit() {
      let date = this.newNotice.date
      this.newNotice.date = date.getTime ? date.getTime() : date
      if (this.title == '新增') {
        let result = await insertNotice(this.newNotice, this.$store.state.user.token)
        if (result.code == 200) {
          this.$message.success('新增成功')
          this.dialogFormVisible = false
          this.init()
        } else {
          this.$message.error('新增失败')
        }
      } else {
        let result = await updateNotice(this.newNotice, this.$store.state.user.token)
        if (result.code == 200) {
          this.$message.success('编辑成功')
          this.dialogFormVisible = false
          this.init()
        } else {
          this.$message.error('编辑失败')
        }
      }
    },
    editNotice(index, notice) {
      this.newNotice = notice
      this.dialogFormVisible = true
      this.title = '编辑'
    },
    deleteNotice(index, id) {
      this.$confirm('是否删除?', { type: 'warning' }).then(async () => {
        let result = await deleteNotice(id, this.$store.state.user.token)
        if (result.code == 200) {
          this.$message.success('删除成功')
          this.init()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    handleCurrent(index) {
      this.page = index
      this.init()
    },
    async init() {
      let result = await getNotices(this.page, this.$store.state.user.token)
      if (result.code == 200) {
        this.notices = result.data
      }
      let count = await getNoticeCount(this.$store.state.user.token)
      if (count.code == 200) {
        this.count = count.data
      }
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
#notice {
  main {
    margin: 2rem;
    border-radius: 4px;
    background-color: white;
    padding: 1rem;
  }
}
</style>
