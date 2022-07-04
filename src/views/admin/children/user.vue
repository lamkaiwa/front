<template>
  <div id="user">
    <main>
      <div>
        <el-button type="primary" @click="insertUser">+新增</el-button>
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
          <el-form :model="newUser" label-width="80px">
            <el-form-item label="邮箱">
              <el-input v-model="newUser.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" v-show="true">
              <el-input v-model="newUser.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="newUser.nick" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="newUser.sex">
                <el-option label="男" :value="0"></el-option>
                <el-option label="女" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="签名">
              <el-input v-model="newUser.sign" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="table">
        <el-table :data="userList" style="width: 100%">
          <el-table-column sortable prop="id" label="id"></el-table-column>
          <el-table-column sortable prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="nick" label="昵称"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{ scope.row.sex | sexFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="sign" label="签名"></el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button @click="editUser(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteUser(scope.$index, scope.row.id)">删除</el-button>
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
import { getUsers, getUsersCount, insertUser, deleteUser, updateUserAdmin } from '../../../api/user'
export default {
  name: 'User',
  computed: {
    usersFilter() {
      return 1
    }
  },
  data() {
    return {
      userList: [
        {
          id: 1,
          email: '1124013284@qq.com',
          nick: 'leolam',
          sex: 1,
          sign: 'asdasdasd',
          fansCount: 23
        },
        {
          id: 2,
          email: '213123123123@qq.com',
          nick: 'leolam',
          sex: 1,
          sign: 'asdasdasd',
          fansCount: 23
        }
      ],
      keyWords: '',
      users: [],
      newUser: {
        email: '',
        password: '',
        nick: '',
        sex: '',
        sign: ''
      },
      title: '',
      dialogFormVisible: false,
      page: 1,
      count: 0,
      pageSize: 10
    }
  },
  methods: {
    insertUser() {
      this.newUser = { password: '' }
      this.dialogFormVisible = true
      this.title = '新增'
    },
    async submit() {
      if (this.title == '新增') {
        let result = await insertUser(this.newUser, this.$store.state.user.token)
        if (result.code == 200) {
          this.page = 1
          this.init()
          this.$message.success('新增用户成功')
        } else {
          this.$message.error('新增用户失败')
        }
      } else {
        let result = await updateUserAdmin(this.newUser, this.$store.state.user.token)
        if (result.code == 200) {
          this.page = 1
          this.init()
          this.$message.success('修改成功用户成功')
        } else {
          this.$message.error('修改用户失败')
        }
      }
      this.dialogFormVisible = false
    },
    editUser(index, user) {
      this.newUser = user
      this.dialogFormVisible = true
      this.title = '编辑'
    },
    deleteUser(index, id) {
      this.$confirm('是否删除?', { type: 'warning' }).then(async () => {
        let result = await deleteUser(id, this.$store.state.user.token)
        if (result.code == 200) {
          this.page = 1
          this.init()
          this.$message.success('删除用户成功')
        } else {
          this.$message.error('删除用户失败')
        }
      })
    },
    handleCurrent(index) {
      this.page = index
    },
    async init() {
      let result = await getUsers(this.page, this.$store.state.user.token)
      if (result.code == 200) {
        this.userList = result.data
      }
      let pageRes = await getUsersCount(this.$store.state.user.token)
      if (pageRes.code == 200) {
        this.count = pageRes.data
      }
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
#user {
  main {
    margin: 2rem;
    border-radius: 4px;
    background-color: white;
    padding: 1rem;
  }
}
</style>
