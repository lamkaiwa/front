import Vue from 'vue'
import Vuex from 'vuex'
import { avatar } from '../api/Url'
import createVuexAlong from 'vuex-along'
import { getUserById } from '../api/user'
Vue.use(Vuex)
export default new Vuex.Store({
  //用户信息
  state: {
    //用户id
    user: null
  },
  //同步
  mutations: {
    setUser(state, user) {
      state.user = user
      if (state.user != null) {
        state.user.headUrl = avatar(state.user.headUrl)
      }
    },
    setHeadUrl(state, headUrl) {
      state.user.headUrl = avatar(headUrl)
    },
    setSign(state, sign) {
      state.user.sign = sign
    },
    setNick(state, nick) {
      state.user.nick = nick
    },
    setSex(state, sex) {
      state.user.sex = sex
    },
    logout(state) {
      state.user = null
    },
    async sendAjaxGetUser(state) {
      if (state == null) {
        this.$message.error('先登录')
        await this.$router.push('/login')
      }
      let token = state.user.token
      let result = await getUserById(state.user.id, token)
      if (result.code == 200) {
        state.user = result.data
        state.user.token = token
      }
      if (state.user != null) {
        state.user.headUrl = avatar(state.user.headUrl)
      }
      console.log(state)
    }
  },
  //异步
  actions: {
    asyncSetUser(context, user) {
      context.commit('setUser', user)
    }
  },
  getters: {
    getUser(state) {
      return state.user
    }
  },
  //解决刷新后vuex数据重置问题
  plugins: [createVuexAlong()]
})
