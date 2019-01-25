<style lang="less">
    @import './own-space.less';
    .cropper-bg{
        width: auto !important;
    }
    .ivu-form-item-error-tip{
        left: 10% !important;
    }
</style>

<template>
    <div>
        <Modal v-model="editPasswordModal" :mask-closable='false' :width="500">
            <h3 slot="header">
                修改密码
            </h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码：" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码：" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码：" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="editPasswordModal = false">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal>
        <Modal
                v-model="isShowHeadPortrait"
                @on-visible-change="headPortraitstatus"
                :mask-closable='false'
                :width="500">
            <h3 slot="header">
                编辑头像
            </h3>
            <div>
                <Row :gutter="10">
                    <Col :sm="15" :xs="24">
                        <img id="cropimg" :src="basicForm.headPortrait" style="height: 250px;"/>
                    </Col>
                    <Col :sm="9" :xs="24">
                        <Row :gutter="10">
                            <Col :sm="24">
                                <div id="preview"  style="height: 170px;width: 170px;border: 1px solid #c1c1c1;overflow: hidden"></div>
                            </Col>
                            <Col :sm="24">
                                <div style="line-height: 38px;margin-top: 10px;">
                                    <label class="headFileLabel" style="padding: 0px 15px;height: 32px;width: 123px;line-height: 32px;" for="fileinput">
                                        <input type="file" icon="image" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" id="fileinput" style="display: none"/>
                                        <Icon style="margin-right: 5px" type="md-cloud-upload"></Icon>上传本地图片
                                    </label>
                                    <Button icon="logo-pinterest">挑选推荐头像</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div class="recommend">
                    <div style="width: 10000px">
                        <div v-for="(item, index) in headPortraitList" :key="index" class="recommend-littleHead">
                            <img :src="item.url" width="50px" height="50px" @click="lookHeadPortrait(item.url)"/>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <Button type="text" @click="isShowHeadPortrait = false">取消</Button>
                <Button type="primary" @click="saveHeadPortrait">保存</Button>
            </div>
        </Modal>
        <Modal v-model="bindingModal" :mask-closable='false' :width="500">
            <h3 slot="header">
                绑定{{bindingModalTitle}}
            </h3>
            <div>
                <div style="width: 200px;margin: 0 auto">
                    <div id="binding"></div>
                    <div style="margin: 0 auto;width: 170px;margin-top: 10px;">请使用<b style="color: #ff000075">{{bindingModalTitle}}APP</b>扫码绑定账号</div>
                </div>
            </div>
            <div slot="footer">
                <Button type="text" @click="bindingModal = false">关闭</Button>
            </div>
        </Modal>
        <Row :gutter="10">
            <Col :sm="18" :xs="24">
                <Card>
                    <p slot="title">
                        <Icon type="person"></Icon>
                        个人中心
                    </p>
                    <div>
                        <Tabs value="userBasic">
                            <TabPane label="基本信息" name="userBasic">
                                <Form class="form-width" ref="basicForm" :model="basicForm" :label-width="100"  label-position="right" :rules="basicValidate" >
                                    <FormItem label="昵称：" prop="nickname">
                                        <Input style="width: 200px;margin-left: 10%" v-model="basicForm.nickname"></Input>
                                    </FormItem>
                                    <FormItem label="用户头像：" prop="headPortrait">
                                        <div class="form-width-headPortrait" @click="showHeadPortrait" @mouseenter="editIcon = true" @mouseleave="editIcon = false">
                                            <span class="form-width-headPortrait-span" title="点击更换头像" v-show="editIcon">
                                                <Icon type="md-refresh-circle" class="form-width-headPortrait-span-icon"/>
                                            </span>
                                            <img :src="basicForm.headPortrait" width="169px" height="169px" />
                                            <Input style="display: none" v-model="basicForm.headPortrait"/>
                                        </div>
                                    </FormItem>
                                    <FormItem label="用户手机：" prop="cellphone" >
                                        <Row style="margin-left: 8%" :gutter="10">
                                            <Col :sm="14" :xs="24">
                                                <Input v-model="basicForm.cellphone" style="width: 200px;" @on-keydown="hasChangePhone"></Input>
                                            </Col>
                                            <Col :sm="4" :xs="24">
                                                <Button @click="getIdentifyCode" :disabled="canGetIdentifyCode">{{ gettingIdentifyCodeBtnContent }}</Button>
                                                <div class="own-space-input-identifycode-con" v-if="inputCodeVisible">
                                                    <div style="background-color:white;margin:10px;">
                                                        <Input v-model="securityCode" placeholder="请填写短信验证码" ></Input>
                                                        <div style="margin-top:10px;text-align:right">
                                                            <Button type="text" @click="cancelInputCodeBox">取消</Button>
                                                            <Button type="primary" @click="submitCode" :loading="checkIdentifyCodeLoading">确定</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem label="登录次数：">
                                        <span style="margin-left: 10%">{{basicForm.loginCount}}</span>
                                    </FormItem>
                                    <FormItem label="创建时间：">
                                        <span style="margin-left: 10%">{{basicForm.creationTime}}</span>
                                    </FormItem>
                                    <FormItem label="登录密码：">
                                        <Button style="margin-left: 10%" type="dashed" size="small" @click="showEditPassword">修改密码</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button type="dashed" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveBasic">保存</Button>
                                    </FormItem>
                                </Form>
                            </TabPane>
                            <TabPane label="联系信息" name="contactInfo">
                                <Form class="form-width" ref="contactInfoForm" :model="contactInfoForm" :label-width="100"  label-position="right" :rules="contactInfoValidate" >
                                    <FormItem label="联系人：" prop="contacts">
                                        <Input style="width: 200px;margin-left: 10%" v-model="contactInfoForm.contacts" ></Input>
                                    </FormItem>
                                    <FormItem label="联系电话：" prop="contactsPhone">
                                        <Input style="width: 200px;margin-left: 10%" v-model="contactInfoForm.contactsPhone"></Input>
                                    </FormItem>
                                    <FormItem label="联系手机：" prop="contactsMobile">
                                        <Input style="width: 200px;margin-left: 10%" v-model="contactInfoForm.contactsMobile"></Input>
                                    </FormItem>
                                    <FormItem label="支付宝：">
                                        <Button style="margin-left: 10%" type="dashed" size="small" @click="showBindingModal('zfb')">未绑定</Button>
                                    </FormItem>
                                    <FormItem label="微信：">
                                        <Button style="margin-left: 10%" type="dashed" size="small" @click="showBindingModal('wx')">未绑定</Button>
                                    </FormItem>
                                    <FormItem label="联系邮箱：" prop="contactsEmail">
                                        <Input style="width: 200px;margin-left: 10%" v-model="contactInfoForm.contactsEmail"></Input>
                                    </FormItem>
                                    <FormItem label="联系QQ：" prop="contactsQQ">
                                        <Input style="width: 200px;margin-left: 10%" v-model="contactInfoForm.contactsQQ"></Input>
                                    </FormItem>
                                    <FormItem label="联系地址：" prop="contactsAddress">
                                        <Cascader style="width: 200px;margin-left: 10%" v-model="contactInfoForm.contactsAddress" :data="cascaderData"  ></Cascader>
                                    </FormItem>
                                    <FormItem>
                                        <Button type="dashed" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                                        <Button type="primary" style="width: 100px;">保存</Button>
                                    </FormItem>
                                </Form>
                            </TabPane>
                            <TabPane label="个人信息" name="name3">
                                <Form class="form-width" ref="personalInfoForm" :model="personalInfoForm" :label-width="100"  label-position="right" :rules="personalInfoValidate">
                                    <FormItem label="姓名：" prop="name">
                                        <Input style="width: 200px;margin-left: 10%" v-model="personalInfoForm.name"></Input>
                                    </FormItem>
                                    <FormItem label="性别：" prop="sex">
                                        <Select  style="width:200px;margin-left: 10%" v-model="personalInfoForm.sex">
                                            <Option value="0" key="0">请选择</Option>
                                            <Option value="2" key="2">男</Option>
                                            <Option value="1" key="1">女</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="年龄：" prop="age">
                                        <Input style="width: 200px;margin-left: 10%" v-model="personalInfoForm.age"></Input>
                                    </FormItem>
                                    <FormItem label="职业信息：" prop="defaultSelect">
                                        <RadioGroup style="margin-left: 10%" v-model="personalInfoForm.defaultSelect" @on-change="jobInfoSwitch">
                                            <Radio label="1">学生</Radio>
                                            <Radio label="2">上班族</Radio>
                                            <Radio label="0">其他</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <div v-show="isStudent">
                                        <FormItem label="学校名称：" prop="schoolName">
                                            <Input style="width: 200px;margin-left: 10%" v-model="personalInfoForm.schoolName"></Input>
                                        </FormItem>
                                        <FormItem label="学校地址：" prop="schoolAddress">
                                            <Input style="width: 200px;margin-left: 10%" v-model="personalInfoForm.schoolAddress"></Input>
                                        </FormItem>
                                    </div>
                                    <div v-show="isIncome">
                                        <FormItem label="收入：" prop="income">
                                            <Select  style="width:200px;margin-left: 10%" v-model="personalInfoForm.income">
                                                <Option  value="0" key="0"><2000</Option>
                                                <Option  value="1" key="1">2000~5000</Option>
                                                <Option  value="2" key="2">5000~10000</Option>
                                                <Option  value="3" key="3">>10000</Option>
                                            </Select>
                                        </FormItem>
                                    </div>
                                    <div v-show="isStaff">
                                        <FormItem label="公司名称：" prop="companyName">
                                            <Input style="width: 200px;margin-left: 10%" v-model="personalInfoForm.companyName"></Input>
                                        </FormItem>
                                        <FormItem label="部门：" prop="'department">
                                            <Input style="width: 200px;margin-left: 10%" v-model="personalInfoForm.department"></Input>
                                        </FormItem>
                                    </div>
                                    <div v-show="isOther">
                                        <FormItem label="职业：" prop="occupation">
                                            <Input style="width: 200px;margin-left: 10%" v-model="personalInfoForm.occupation"></Input>
                                        </FormItem>
                                    </div>
                                    <FormItem label="自我描述：" prop="selfDescription">
                                        <Input style="margin-left: 10%;width: 200px"  type="textarea" :rows="4" v-model="personalInfoForm.selfDescription" placeholder="请输入自我描述..." />
                                    </FormItem>
                                    <FormItem>
                                        <Button type="dashed" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                                        <Button type="primary" style="width: 100px;">保存</Button>
                                    </FormItem>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </div>
                </Card>
            </Col>
            <Col :sm="6" :xs="0">
                <Card style="">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        简单说明
                    </p>
                    <div>
                        为您的个人账号设置一个保存信息的个人空间。用您的用户名登录，个人中心中会显示修改用户信息的选项，点击进入后，就可以在这里修改管理您的个人资料了，包括修改头像、性别、年龄、婚姻状况、血型、星座、出生地、居住地、曾就读学校、喜欢的书籍、喜欢的音乐、喜欢的电影、喜欢的运动、欣赏的人和其它兴趣爱好，输入您需要填写的信息，点击"保存"，修改个人信息便完成了。通过填写详细的个人信息，您可以寻找到更多和您志同道合的人，同时，会让更多的人关注到您。
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import Cropper from 'cropperjs';
    import $util from '@/libs/util.js';
    import QRCode from 'qrcodejs2';

export default {
    name: 'ownspace_index',
    data () {
        const validePhone = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        const valideEmail = (rule, value, callback) => {
                var re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!re.test(value)) {
                    callback(new Error('请输入正确格式邮箱号'));
                } else {
                    callback();
                }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            basicForm: {
                nickname: '',
                cellphone: '',
                loginCount:'10',
                creationTime:'2018-01-02',
                headPortrait:localStorage.avatorImgPath,
            },
            basicValidate: {
                nickname: [
                    { required: true, message: '请输入昵称', trigger: 'blur' }
                ],
                cellphone: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ]
            },
            contactInfoForm:{
                contacts: '',
                contactsPhone: '',
                contactsMobile: '',
                contactsEmail: '',
                contactsQQ: '',
                contactsAddress: [],
            },
            contactInfoValidate: {
                contacts: [
                    { required: true, message: '请输入联系人名称', trigger: 'blur' }
                ],
                contactsMobile: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ],
                contactsEmail: [
                    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
                    { validator: valideEmail }
                ]
            },
            personalInfoForm: {
                name: '',
                sex: '0',
                age: '',
                defaultSelect: '1', // 默认选中学生
                schoolName: '',
                schoolAddress: '',
                income: '',
                companyName: '',
                department: '',
                occupation: '',
                selfDescription: '',
            },
            personalInfoValidate: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' }
                ],
            },
            cascaderData:[{
                value: 'beijing',
                label: '北京',
                children: [
                    {
                        value: 'gugong',
                        label: '故宫'
                    },
                    {
                        value: 'tiantan',
                        label: '天坛'
                    },
                    {
                        value: 'wangfujing',
                        label: '王府井'
                    }
                ]
            }, {
                value: 'jiangsu',
                label: '江苏',
                children: [
                    {
                        value: 'nanjing',
                        label: '南京',
                        children: [
                            {
                                value: 'fuzimiao',
                                label: '夫子庙',
                            }
                        ]
                    },
                    {
                        value: 'suzhou',
                        label: '苏州',
                        children: [
                            {
                                value: 'zhuozhengyuan',
                                label: '拙政园',
                            },
                            {
                                value: 'shizilin',
                                label: '狮子林',
                            }
                        ]
                    }
                ],
            }],
            isShowHeadPortrait: false, // 用户头像对话框显示
            bindingModal: false, // 绑定移动端对话框显示
            bindingModalTitle:'', // 绑定对话框标题
            editIcon: false, // 头像编辑显示
            cropper:{}, //头像编辑框
            headPortraitList:[
                {url:'http://img0.imgtn.bdimg.com/it/u=3486208998,2229578290&fm=26&gp=0.jpg'},
                {url:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3858484478,3500660839&fm=26&gp=0.jpg'},
                {url:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1002919774,3906438198&fm=26&gp=0.jpg'},
                {url:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2344723972,1134179580&fm=26&gp=0.jpg'},
                {url:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1324198412,330510552&fm=26&gp=0.jpg'},
                {url:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=22502317,212960811&fm=26&gp=0.jpg'},
                {url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548320869342&di=3213aecf3f0838fd471dffd784aa057d&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0132255a604c8da80120121f36db45.gif'},
                {url:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1134728469,27057145&fm=26&gp=0.jpg'},
                {url:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1028410452,465459249&fm=26&gp=0.jpg'},
                {url:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=101925125,1677893626&fm=26&gp=0.jpg'},
                {url:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2792416421,2006182417&fm=26&gp=0.jpg'},
                {url:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1435973750,3806331976&fm=26&gp=0.jpg'},
            ],
            isStudent: true,   // 是否学生
            isStaff: false,     // 是否员工
            isOther: false,     // 是否其他
            isIncome: false,    // 收入
            securityCode: '', // 验证码
            phoneHasChanged: false, // 是否编辑了手机
            save_loading: false,
            identifyError: '', // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            identifyCodeRight: false, // 验证码是否正确
            hasGetIdentifyCode: false, // 是否点了获取验证码
            canGetIdentifyCode: false, // 是否可点获取验证码
            checkIdentifyCodeLoading: false,
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
            inputCodeVisible: false, // 显示填写验证码box
            initPhone: '',
            gettingIdentifyCodeBtnContent: '获取验证码' // “获取验证码”按钮的文字
        };
    },
    methods: {
        getIdentifyCode () {
            this.hasGetIdentifyCode = true;
            this.$refs['basicForm'].validate((valid) => {
                if (valid) {
                    this.canGetIdentifyCode = true;
                    let timeLast = 60;
                    let timer = setInterval(() => {
                        if (timeLast >= 0) {
                            this.gettingIdentifyCodeBtnContent = timeLast + '秒后重试';
                            timeLast -= 1;
                        } else {
                            clearInterval(timer);
                            this.gettingIdentifyCodeBtnContent = '获取验证码';
                            this.canGetIdentifyCode = false;
                        }
                    }, 1000);
                    this.inputCodeVisible = true;
                    // you can write ajax request here
                }
            });
        },
        showEditPassword () {
            this.editPasswordModal = true;
        },
        showHeadPortrait () {
            this.isShowHeadPortrait = true;
            let img = document.getElementById('cropimg');
            this.cropper = new Cropper(img, {
                dragMode: 'move',    // 定义cropper的拖拽模式。
                preview: '#preview', // 添加额外的元素(容器)以供预览。
                guides:true,         // 显示在裁剪框上方的虚线。
                autoCropArea:0.5,    // 定义自动裁剪面积大小(百分比)和图片进行对比。
                restore: true,       // 在调整窗口大小后恢复裁剪的区域。
                center: true,        // 裁剪框在图片正中心。
                movable:true,       // 是否允许可以移动后面的图片
                highlight: false,    // 在裁剪框上方显示白色的区域(突出裁剪框)。
                cropBoxMovable: true,// 是否通过拖拽来移动剪裁框。
                zoomOnWheel:false,   // 是否可以通过移动鼠标来放大图像。
                toggleDragModeOnDblclick: true, // 当点击两次时可以在“crop”和“move”之间切换拖拽模式。
            });
        },
        headPortraitstatus (){
            this.cropper.destroy();
        },
        handleChange(e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                this.cropper.replace(reader.result);
                reader.onload = null;
            };
            reader.readAsDataURL(file);
        },
        lookHeadPortrait(data){
            this.cropper.load(data);
        },
        saveHeadPortrait(){
            let file = this.cropper.getCroppedCanvas().toDataURL();
            let upFile = $util.base64toFile(file,'headPortrait');
            // TODO 图片上传
            console.info(this.basicForm.headPortrait);
            this.basicForm.headPortrait = file;
            this.isShowHeadPortrait = false;
        },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.app.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveBasic () {
            this.$refs['basicForm'].validate((valid) => {
                if (valid) {
                    if (this.phoneHasChanged && this.basicForm.cellphone !== this.initPhone) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
                        if (this.hasGetIdentifyCode) { // 判断是否点了获取验证码
                            if (this.identifyCodeRight) { // 判断验证码是否正确
                                this.saveInfoAjax();
                            } else {
                                this.$Message.error('验证码错误，请重新输入');
                            }
                        } else {
                            this.$Message.warning('请先点击获取验证码');
                        }
                    } else {
                        this.saveInfoAjax();
                    }
                }
            });
        },
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;
                    // you can write ajax request here
                }
            });
        },
        showBindingModal(data){
            let url;
            let title;
            if(data == 'wx'){
                title = '微信';
                url = 'getAlipayLoginPath';
            }else if(data == 'zfb'){
                title = '支付宝';
                url = 'getAlipayLoginPath';
            }
            let _this = this;
            $util.post(url, {})
                .then(function (response) {
                    if (response.status == 200) {
                        if (response.data.statusCode == '10000') {
                            let path = response.data.data;
                            var div = document.getElementById('binding');
                            div.innerHTML = "";
                            let qrcode = new QRCode('binding', {
                                width: 200,
                                height: 200, // 高度
                                text: path // 二维码内容
                            });
                            div.title = "请使用手机"+title+"APP扫描二维码";
                            _this.bindingModalTitle = title;
                            _this.bindingModal = true;
                        } else {
                            $util.responseMsg(_this, response.data);
                        }
                    } else {
                        $util.httpErrorMsg(_this, response.data);
                    }
                })
                .catch(function (error) {
                    $util.httpErrorMsg(_this, error.data);
                });
        },
        jobInfoSwitch (){
            this.isStudent = false;   // 是否学生
            this.isStaff = false;     // 是否员工
            this.isOther = false;     // 是否其他
            this.isIncome = false;    // 收入
            if(this.personalInfoForm.defaultSelect == '1'){
                this.isStudent = true;
            }else if(this.personalInfoForm.defaultSelect == '2'){
                this.isStaff = true;
                this.isIncome = true;
            }else if(this.personalInfoForm.defaultSelect == '0'){
                this.isOther = true;
                this.isIncome = true;
            }
            //console.info(this.personalInfoForm.defaultSelect);
        },
        init () {
            this.basicForm.nickname = 'Lison';
            this.basicForm.cellphone = '17712345678';
            this.initPhone = '17712345678';
            //this.basicForm.company = 'TalkingData';
           // this.basicForm.department = '可视化部门';
        },
        cancelInputCodeBox () {
            this.inputCodeVisible = false;
            this.basicForm.cellphone = this.initPhone;
        },
        submitCode () {
            let vm = this;
            vm.checkIdentifyCodeLoading = true;
            if (this.securityCode.length === 0) {
                this.$Message.error('请填写短信验证码');
            } else {
                setTimeout(() => {
                    this.$Message.success('验证码正确');
                    this.inputCodeVisible = false;
                    this.checkIdentifyCodeLoading = false;
                }, 1000);
            }
        },
        hasChangePhone () {
            this.phoneHasChanged = true;
            this.hasGetIdentifyCode = false;
            this.identifyCodeRight = false;
        },
        saveInfoAjax () {
            this.save_loading = true;
            setTimeout(() => {
                this.$Message.success('保存成功');
                this.save_loading = false;
            }, 1000);
        }
    },
    mounted () {
        this.init();
    }
};
</script>
