# 门博士项目系列--后台管理系统

基于Vue-admin-template，运用以下技术栈：Vue全家桶(Vue2, Vuex, Vue-router, vue-cli)，axios，elementUI。

门博士项目系列：

[后端服务器](https://github.com/lwn-ysy/mbsdoorServer)

[前台--微信小程序](https://github.com/lwn-ysy/mbsDoor)

------



### elementUI upload组件的踩坑

① fileList属性

官方解释：上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]。

我在实践中感觉更像：已上传的文件列表。

添加至fileList里的文件，status状态自动变为：success，即使你之前没有操作过上传此文件，后续也不会上传。

②submit方法

手动上传，可通过this.$refs.upload.submit()触发http-requset上传方法，但如果所有file的status为success，是不会触发的，即定义的http-request方法不会执行。