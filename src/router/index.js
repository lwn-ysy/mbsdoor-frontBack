import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: 'external-link',
    component: Layout,
    meta: {
      title: "github地址",
      icon: 'link'
    },
    children: [
      {
        path: 'https://github.com/lwn-ysy/mbsDoor',
        meta: { title: '小程序--门博士系列' }
      },
      {
        path: 'https://github.com/lwn-ysy/mbsdoor-frontBack',
        meta: { title: '后台系统--门博士系列' }
      },
      {
        path: 'https://github.com/lwn-ysy/mbsdoorServer',
        meta: { title: '后端--门博士系列' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

export const asyncRoutes = [
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/page',
    alwaysShow: true,
    name: 'Shop',
    meta: {
      title: '商品系统',
      icon: 'lock',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/shop/page'),
        name: 'ShopPage',
        meta: {
          title: '基本信息',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'detail',
        component: () => import('@/views/shop/detail'),
        name: 'ShopDetail',
        hidden: true,
        meta: {
          title: '详情信息',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'category',
        component: () => import('@/views/shop/category'),
        name: 'ShopCategory',
        meta: {
          title: '品类总表',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'tag',
        component: () => import('@/views/shop/tag'),
        name: 'ShopTag',
        meta: {
          title: '标签总表',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'addshop',
        component: () => import('@/views/shop/addshop'),
        name: 'AddShop',
        hidden: true,
        meta: {
          title: '添加商品',
          roles: ['admin', 'editor'],
        },
      },
      {
        path: 'updateshop',
        component: () => import('@/views/shop/updateshop'),
        name: 'UpdateShop',
        hidden: true,
        meta: {
          title: '更新商品',
          roles: ['admin', 'editor'],
        },
        props($route) {
          return {
            shopID: $route.query.shopID
          }
        }
      },
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/banner',
    alwaysShow: true,
    name: 'Activity',
    meta: {
      title: '活动系统',
      icon: 'lock',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'banner',
        component: () => import('@/views/activity/banner'),
        name: 'ActivityBanner',
        meta: {
          title: '轮播图',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'addbanner',
        component: () => import('@/views/activity/addbanner'),
        name: 'ActivityAddBanner',
        meta: {
          title: '添加轮播图',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/page',
    alwaysShow: true, // will always show the root menu
    name: 'Account',
    meta: {
      title: '账号系统',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/account/index'),
        name: 'PageAccount',
        meta: {
          title: '账号管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/role',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限系统',
      icon: 'lock',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '权限管理',
          roles: ['admin']
        }
      },
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '权限列表',
          roles: ['editor', 'tourist']
        }
      }
    ]
  },



  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
