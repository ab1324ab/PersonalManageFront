import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/home',
        icon:'ios-home-outline',
        title: {i18n: 'home'},
        name: 'home',
        component: Main,
        children:[
            { path: 'home',icon:'ios-home-outline', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        ]
    },
    {
        path: '/repository',
        icon: 'md-list',
        title: '文件列表',
        name: 'resources',
        component: Main,
        children: [
            { path: 'resource-list',icon: 'ios-paper', title: '文件列表', name: 'resource-list', component: () => import('@/views/repository/resource-list.vue') },
            { path: 'create-word',icon: 'logo-wordpress', title: '新建文档', name: 'create-word', component: () => import('@/views/repository/create-word.vue') },
            { path: 'create-excel',icon: 'md-grid', title: '新建表格', name: 'create-excel', component: () => import('@/views/repository/create-excel.vue') },
            { path: 'create-image',icon: 'md-image', title: '新建图片', name: 'create-image', component: () => import('@/views/repository/create-image.vue') }
        ]
    },
    {
        path: '/work-sheet',
        icon: 'ios-create-outline',
        title: '工作记录',
        name: 'worksheet',
        component: Main,
        children: [
            { path: 'recordation',icon: 'ios-create-outline' ,title: '工作记录', name: 'recordation', component: () => import('@/views/work-sheet/recordation.vue') },
        ]
    },
    {
        path: '/recycler',
        icon: 'ios-trash-outline',
        title: '回收站',
        name: 'recycle bin',
        component: Main,
        children: [
            { path: 'cleaner',icon: 'ios-trash' ,title: '回收站', name: 'cleaner', component: () => import('@/views/recycler/cleaner.vue') },
        ]
    },
    // {
    //     path: '/port-routing',
    //     icon: 'ios-pulse',
    //     title: '接口路由',
    //     name: 'portRouting',
    //     component: Main,
    //     children: [
    //         { path: 'apiRoute',icon: 'android-options', title: 'API路由控制器', name: 'apiRoute', component: () => import('@/views/port-routing/apiRoute.vue') },
    //         { path: 'clientCtrl',icon: 'monitor', title: '客户端控制器', name: 'clientCtrl', component: () => import('@/views/port-routing/clientCtrl.vue') },
    //     ]
    // },
    // {
    //     path: '/international',
    //     icon: 'earth',
    //     title: {i18n: 'international'},
    //     name: 'international',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
    //     ]
    // },

    // {
    //     path: '/component',
    //     icon: 'social-buffer',
    //     name: 'component',
    //     title: '组件',
    //     component: Main,
    //     children: [
    //         { path: 'text-editor',icon: 'compose',name: 'text-editor',title: '富文本编辑器',component: () => import('@/views/my-components/text-editor/text-editor.vue')},
    //         { path: 'md-editor',icon: 'pound',name: 'md-editor',title: 'Markdown编辑器',component: () => import('@/views/my-components/markdown-editor/markdown-editor.vue')},
    //         { path: 'image-editor',icon: 'crop',name: 'image-editor',title: '图片预览编辑',component: () => import('@/views/my-components/image-editor/image-editor.vue')},
    //         { path: 'draggable-list',icon: 'arrow-move',name: 'draggable-list',title: '可拖拽列表',component: () => import('@/views/my-components/draggable-list/draggable-list.vue')},
    //         { path: 'area-linkage',icon: 'ios-more',name: 'area-linkage',title: '城市级联',component: () => import('@/views/my-components/area-linkage/area-linkage.vue')},
    //         { path: 'file-upload',icon: 'android-upload',name: 'file-upload',title: '文件上传',component: () => import('@/views/my-components/file-upload/file-upload.vue')},
    //         { path: 'count-to',icon: 'arrow-graph-up-right',name: 'count-to',title: '数字渐变',component: () => import('@/views/my-components/count-to/count-to.vue')},
    //         { path: 'split-pane-page',icon: 'ios-pause',name: 'split-pane-page',title: 'split-pane',component: () => import('@/views/my-components/split-pane/split-pane-page.vue')},
    //         { path: 'errorpage_index',icon: 'bug', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue') },
    //         { path: 'access_index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') },
    //         { path: 'accesstest_index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue') },
    //         { path: 'international_index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
    //     ]
    // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格表单',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: () => import('@/views/tables/dragable-table.vue') },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: () => import('@/views/tables/editable-table.vue') },
    //         { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: () => import('@/views/tables/searchable-table.vue') },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: () => import('@/views/tables/exportable-table.vue') },
    //         { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: () => import('@/views/tables/table-to-image.vue') },
    //         { path: 'artical-publish',title: '文章发布',name: 'artical-publish',icon: 'compose',component: () => import('@/views/form/article-publish/article-publish.vue')},
    //         { path: 'workflow',title: '工作流',name: 'workflow',icon: 'arrow-swap',component: () => import('@/views/form/work-flow/work-flow.vue')}
    //     ]
    // },
    // {
    //     path: '/advanced-router',
    //     icon: 'ios-infinite',
    //     name: 'advanced-router',
    //     title: '高级路由',
    //     component: Main,
    //     children: [
    //         { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: () => import('@/views/advanced-router/mutative-router.vue') },
    //         { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: () => import('@/views/advanced-router/argument-page.vue') }
    //     ]
    // },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
