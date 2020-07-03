<template>
  <div>
    <KForm :model="model" ref="loginForm" :rules="rules">
      <KFormItem label="用户名" prop="username">
        <KInput v-model="model.username" placeholder="请输入用户名" />
      </KFormItem>
      <KFormItem label="密码" prop="password">
        <KInput v-model="model.password" placeholder="请输入密码" />
      </KFormItem>

      <KFormItem>
        <button @click="login">登录</button>
      </KFormItem>
    </KForm>
    <!-- <p>{{model}}</p> -->
  </div>
</template>

<script>
import KInput from "@/components/form/KInput";
import KFormItem from "@/components/form/KFormItem";
import KForm from "@/components/form/KForm";
import create from '@/utils/create'
import Notice from '@/components/Notice'

export default {
  components: {
    KInput,
    KFormItem,
    KForm
  },
  data() {
    return {
      model: {
        username: "Tom",
        password: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码"
          }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(isValid => {
        // 创建notice实例
        create(Notice,{
          title:'1111',
          message:isValid?'请求登录':"校验失败"
        }).show()
        // if (isValid) {
        //   //   合法
        //   console.log("request Login");
        // }else{
        //   console.log("form error");

        // }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>