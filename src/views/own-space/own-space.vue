<style lang="less">
    @import './own-space.less';
    .cropper-bg{
        width: auto !important;
    }
</style>

<template>
    <div>
        <Modal v-model="editPasswordModal" :mask-closable='false' :width="400">
            <h3 slot="header">
                修改密码
            </h3>
            <div style="width: 310px;margin: 0 auto">
                <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                    <FormItem label="原密码" prop="oldPass">
                        <Input id="oldPassInput" style="width: 200px" type="password" v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" >
                        <Icon v-if="!oldPassIcon" type="md-eye-off" slot="suffix" @click="showPasswordInput('oldPassInput')" />
                        <Icon v-if="oldPassIcon" type="md-eye" slot="suffix" @click="showPasswordInput('oldPassInput')" />
                        </Input>
                    </FormItem>
                    <FormItem label="新密码" prop="newPass">
                        <Input id="newPassInput" style="width: 200px" type="password" v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" >
                        <Icon v-if="!newPassIcon" type="md-eye-off" slot="suffix" @click="showPasswordInput('newPassInput')" />
                        <Icon v-if="newPassIcon" type="md-eye" slot="suffix" @click="showPasswordInput('newPassInput')" />
                        </Input>
                    </FormItem>
                    <FormItem label="确认新密码" prop="rePass">
                        <Input id="rePassInput" style="width: 200px" type="password" v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" >
                        <Icon v-if="!rePassIcon" type="md-eye-off" slot="suffix" @click="showPasswordInput('rePassInput')" />
                        <Icon v-if="rePassIcon" type="md-eye" slot="suffix" @click="showPasswordInput('rePassInput')" />
                        </Input>
                    </FormItem>
                    <FormItem label="手机验证码" prop="modifyCode">
                        <Input style="width: 100px;margin-right: 5px" type="text" :maxlength="6" v-model="editPasswordForm.modifyCode" placeholder="请输入验证码" ></Input>
                        <Button @click="getModifyCode" :disabled="modifyDisabled">{{modifyContent}}</Button>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="editPasswordModal = false">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">修改</Button>
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
                            <Col :sm="24" style="height: 170px;width: 170px;margin:0 auto;">
                                <div id="preview"  style="height: 170px;border: 1px solid #c1c1c1;overflow: hidden"></div>
                            </Col>
                            <Col :sm="24">
                                <div style="line-height: 38px;margin-top: 10px;">
                                    <label class="headFileLabel" for="fileinput" @click="isShowFile = true">
                                        <input type="file" v-if="isShowFile" icon="image" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" id="fileinput" style="display: none"/>
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
                <Button type="primary" @click="saveHeadPortrait">确定</Button>
            </div>
        </Modal>
        <Modal v-model="bindingModal"
               :mask-closable='false'
               :width="500"
               :on-visible-change="bindingModalClose">
            <h3 slot="header">
                绑定{{bindingModalTitle}}
            </h3>
            <div>
                <div style="width: 200px;margin: 0 auto">
                    <div id="binding"></div>
                    <div style="margin: 0 auto;width: 170px;margin-top: 10px;">请使用<b style="color: red">{{bindingModalTitle}}APP</b>扫码绑定账号</div>
                </div>
            </div>
            <div slot="footer">
                <Button type="text" @click="bindingModal = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="untieModal"
               :mask-closable='false'
               :width="400">
            <h3 slot="header">
                是否解绑{{untieModalTitle}}？
            </h3>
            <div style="width: 300px;margin: 0 auto;">
                <Form :label-width="80">
                    <div style="width: 215px; margin: 0px auto 24px;">App扫码解绑请输入<b style="color: red" title="手机必须已绑定">已绑定手机</b>的验证码</div>
                    <FormItem label="手机号">
                        <span v-if="basicForm.mobileStatus == '0'" style="color: red">请先绑定手机号</span>
                        <span v-if="basicForm.mobileStatus == '1'">{{basicForm.cellphone}}</span>
                    </FormItem>
                    <FormItem label="验证码">
                        <Input style="width: 40%;margin-right: 5px" :maxlength="6" placeholder="请输入验证码"></Input>
                        <Button>获取验证码</Button>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="untieModal = false">取消</Button>
                <Button type="primary" @click="untieModal = false">确定</Button>
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
                        <Tabs value="userBasic" >
                            <TabPane label="基本信息" name="userBasic">
                                <Card style="height: 100%">
                                    <Form class="form-width" ref="basicForm" :model="basicForm" :label-width="80"  label-position="right" :rules="basicValidate" >
                                        <FormItem label="昵称：" prop="nickname">
                                            <Input class="form-width-input" v-model="basicForm.nickname" placeholder="请输入昵称"></Input>
                                        </FormItem>
                                        <FormItem label="头像：" prop="headPortrait">
                                            <div class="form-width-headPortrait" @click="showHeadPortrait" @mouseenter="editIcon = true" @mouseleave="editIcon = false">
                                                <span class="form-width-headPortrait-span" title="点击更换头像" v-show="editIcon">
                                                    <Icon type="md-refresh-circle" class="form-width-headPortrait-span-icon"/>
                                                </span>
                                                <img :src="basicForm.headPortrait" width="169px" height="169px" />
                                                <Input style="display: none" v-model="basicForm.headPortrait"/>
                                            </div>
                                        </FormItem>
                                        <FormItem label="手机：" prop="cellphone" >
                                            <Row>
                                                <Col :xs="24" :sm="12">
                                                    <Input v-model="basicForm.cellphone" style="width: 90%;" :disabled="basicForm.mobileStatus == '1'" placeholder="请输入手机号"></Input>
                                                </Col>
                                                <Col :xs="10" :sm="12">
                                                    <Button v-if="basicForm.mobileStatus == '0'" @click="getBindingCode" :disabled="bindingDisabled">{{bindingContent}}</Button>
                                                    <Button v-if="basicForm.mobileStatus == '1'" @click="getUntieCode" :disabled="untieDisabled">{{untieContent}}</Button>
                                                    <div class="own-space-input-identifycode-con" v-if="showInputCodeDiv">
                                                        <div style="background-color:white;margin:10px;">
                                                            <Input v-model="securityCode" :maxlength="6" placeholder="请输入验证码" ></Input>
                                                            <div style="margin-top:10px;text-align:right">
                                                                <Button type="text" @click="showInputCodeDiv = false">取消</Button>
                                                                <Button v-if="basicForm.mobileStatus == '0'" type="primary" @click="submitBindingCode" :loading="checkBindingLoading">确定绑定</Button>
                                                                <Button v-if="basicForm.mobileStatus == '1'" type="primary" @click="submitUntieCode" :loading="checkUntieLoading">确定解绑</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </FormItem>
                                        <FormItem label="状态：">
                                            <span  v-text="mobileStatusText"></span>
                                        </FormItem>
                                        <FormItem label="登录次数：">
                                            <span>{{basicForm.loginCount}}</span>
                                        </FormItem>
                                        <FormItem label="创建时间：">
                                            <span>{{basicForm.creationTime}}</span>
                                        </FormItem>
                                        <FormItem label="登录密码：">
                                            <Button type="dashed" size="small" @click="showEditPassword">修改密码</Button>
                                        </FormItem>
                                        <div style="width: 210px;margin: 0 auto;">
                                            <Button type="dashed" style="width: 100px;margin-right: 5px" @click="cancelEditUserInfor">取消</Button>
                                            <Button type="primary" style="width: 100px;" :loading="userBasicloading" @click="saveBasic">保存</Button>
                                        </div>
                                    </Form>
                                </Card>
                            </TabPane>
                            <TabPane label="联系信息" name="contactInfo">
                                <Card style="height: 100%">
                                    <Form class="form-width" ref="contactInfoForm" :model="contactInfoForm" :label-width="100"  label-position="right" :rules="contactInfoValidate" >
                                        <FormItem label="联系人：" prop="contacts">
                                            <Input class="form-width-input"  v-model="contactInfoForm.contacts" placeholder="请输入联系人"></Input>
                                        </FormItem>
                                        <FormItem label="联系电话：" prop="contactsPhone">
                                            <Input class="form-width-input" v-model="contactInfoForm.contactsPhone" placeholder="请输入联系电话号码"></Input>
                                        </FormItem>
                                        <FormItem label="联系手机：" prop="contactsMobile">
                                            <Input class="form-width-input" v-model="contactInfoForm.contactsMobile" placeholder="请输入联系手机号"></Input>
                                        </FormItem>
                                        <FormItem label="支付宝：">
                                            <Button v-if="contactInfoForm.isAlipayBinding == '0'" type="dashed" size="small" @click="showBindingModal('zfb')">未绑定</Button>
                                            <Button v-if="contactInfoForm.isAlipayBinding == '1'" type="dashed" size="small" @click="showUntieModal('zfb')">已绑定</Button>
                                        </FormItem>
                                        <FormItem label="微信：">
                                            <Button v-if="contactInfoForm.isWxBinding == '0'" type="dashed" size="small" @click="showBindingModal('wx')">未绑定</Button>
                                            <Button v-if="contactInfoForm.isWxBinding == '1'" type="dashed" size="small" @click="showUntieModal('wx')">已绑定</Button>
                                        </FormItem>
                                        <FormItem label="联系邮箱：" prop="contactsEmail">
                                            <Input class="form-width-input" v-model="contactInfoForm.contactsEmail" placeholder="请输入联系邮箱地址"></Input>
                                        </FormItem>
                                        <FormItem label="联系QQ：" prop="contactsQQ">
                                            <Input class="form-width-input" v-model="contactInfoForm.contactsQQ" placeholder="请输入联系QQ"></Input>
                                        </FormItem>
                                        <FormItem label="联系地址：" prop="contactsAddress">
                                            <Cascader style="width: 90%" v-model="contactInfoForm.contactsAddress" :data="cascaderData"  ></Cascader>
                                        </FormItem>
                                        <div style="width: 210px;margin: 0 auto">
                                            <Button type="dashed" style="width: 100px;margin-right: 5px" @click="cancelEditUserInfor">取消</Button>
                                            <Button type="primary" style="width: 100px;" :loading="contactInfoloading"  @click="saveContactInfo">保存</Button>
                                        </div>
                                    </Form>
                                </Card>
                            </TabPane>
                            <TabPane label="个人信息" name="personalInfo">
                                <Card style="height: 100%">
                                    <Form class="form-width" ref="personalInfoForm" :model="personalInfoForm" :label-width="80"  label-position="right" :rules="personalInfoValidate">
                                        <FormItem label="姓名：" prop="name">
                                            <Input class="form-width-input" v-model="personalInfoForm.name" placeholder="请输入个人姓名"></Input>
                                        </FormItem>
                                        <FormItem label="性别：" prop="sex">
                                            <Select class="form-width-input" v-model="personalInfoForm.sex">
                                                <Option value="0" key="0">保密</Option>
                                                <Option value="1" key="1">女</Option>
                                                <Option value="2" key="2">男</Option>
                                            </Select>
                                        </FormItem>
                                        <FormItem label="年龄：" prop="age">
                                            <Input class="form-width-input" :maxlength="3" v-model="personalInfoForm.age" placeholder="请输入年龄"></Input>
                                        </FormItem>
                                        <FormItem label="职业信息：" prop="defaultSelect">
                                            <RadioGroup v-model="personalInfoForm.defaultSelect" @on-change="jobInfoSwitch">
                                                <Radio label="1">学生</Radio>
                                                <Radio label="2">上班族</Radio>
                                                <Radio label="0">其他</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                        <div v-show="isStudent">
                                            <FormItem label="学校名称：" prop="schoolName">
                                                <Input class="form-width-input" v-model="personalInfoForm.schoolName" placeholder="请输入学校名称"></Input>
                                            </FormItem>
                                            <FormItem label="学校地址：" prop="schoolAddress">
                                                <Input class="form-width-input" v-model="personalInfoForm.schoolAddress" placeholder="请输入学校地址"></Input>
                                            </FormItem>
                                        </div>
                                        <div v-show="isIncome">
                                            <FormItem label="收入：" prop="income">
                                                <Select  class="form-width-input" v-model="personalInfoForm.income">
                                                    <Option  value="0" key="0"><2000</Option>
                                                    <Option  value="1" key="1">2000~5000</Option>
                                                    <Option  value="2" key="2">5000~10000</Option>
                                                    <Option  value="3" key="3">>10000</Option>
                                                </Select>
                                            </FormItem>
                                        </div>
                                        <div v-show="isStaff">
                                            <FormItem label="公司名称：" prop="companyName">
                                                <Input class="form-width-input" v-model="personalInfoForm.companyName" placeholder="请输入公司名称"></Input>
                                            </FormItem>
                                            <FormItem label="部门名称：" prop="departments">
                                                <Input class="form-width-input" v-model="personalInfoForm.departments" placeholder="请输入部门名称"></Input>
                                            </FormItem>
                                        </div>
                                        <div v-show="isOther">
                                            <FormItem label="职业名称：" prop="occupation">
                                                <Input class="form-width-input" v-model="personalInfoForm.occupation" placeholder="请输入职业名称"></Input>
                                            </FormItem>
                                        </div>
                                        <FormItem label="自我描述：" prop="selfDescription">
                                            <Input class="form-width-input"  type="textarea" :rows="4" v-model="personalInfoForm.selfDescription" placeholder="请输入自我描述..." />
                                        </FormItem>
                                        <div style="width: 210px;margin: 0 auto">
                                            <Button type="dashed" style="width: 100px;margin-right: 5px" @click="cancelEditUserInfor">取消</Button>
                                            <Button type="primary" style="width: 100px;" :loading="personalInfoloading" @click="savePersonalInfo">保存</Button>
                                        </div>
                                    </Form>
                                </Card>
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
    var qs = require('qs');

export default {
    name: 'ownspace_index',
    data () {
            const validePhone = (rule, value, callback) => {
                var re = /^1[0-9]{10}$/;
                if (!re.test(value) && this.basicForm.mobileStatus == '0') {
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
            const valideQQ = (rule, value, callback) => {
                var re = /^[1-9]*[1-9][0-9]*$/;
                if (value != '' && !re.test(value)) {
                    callback(new Error('请输入正确QQ号'));
                } else {
                    callback();
                }
            };
            const sexValide = (rule, value, callback) => {
                if (this.personalInfoForm.sex == null || this.personalInfoForm.sex == '') {
                    callback(new Error('请选择性别'));
                } else {
                    callback();
                }
            };
            const ageValide = (rule, value, callback) => {
                var re = /^[0-9]*$/;
                if (!re.test(value)) {
                    callback(new Error('年龄为数字，请输入数字'));
                } else {
                    callback();
                }
            };
            const codeValide = (rule, value, callback) => {
                var re = /^[0-9]*$/;
                if (!re.test(value)) {
                    callback(new Error('请输入数字验证码'));
                } else {
                    callback();
                }
            };
            const schoolNameValide = (rule, value, callback) => {
                var re = this.personalInfoForm.defaultSelect;
                if (re == '1') {
                    if (this.personalInfoForm.schoolName == null || this.personalInfoForm.schoolName == '') {
                        callback(new Error('请输入学校名称'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const schoolAddressValide = (rule, value, callback) => {
                var re = this.personalInfoForm.defaultSelect;
                if (re == '1') {
                    if (this.personalInfoForm.schoolAddress == null || this.personalInfoForm.schoolAddress == '') {
                        callback(new Error('请输入学校地址'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const incomeValide = (rule, value, callback) => {
                var re = this.personalInfoForm.defaultSelect;
                if (re == '2' || re == '0') {
                    if (this.personalInfoForm.income == null || this.personalInfoForm.income == '') {
                        callback(new Error('请选择收入信息'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const companyNameValide = (rule, value, callback) => {
                var re = this.personalInfoForm.defaultSelect;
                if (re == '2') {
                    if (this.personalInfoForm.companyName == null || this.personalInfoForm.companyName == '') {
                        callback(new Error('请输入公司名称'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const departmentValide = (rule, value, callback) => {
                var re = this.personalInfoForm.defaultSelect;
                if (re == '2') {
                    if (this.personalInfoForm.departments == null || this.personalInfoForm.departments == '') {
                        callback(new Error('请输入部门名称'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const occupationValide = (rule, value, callback) => {
                var re = this.personalInfoForm.defaultSelect;
                if (re == '0') {
                    if (this.personalInfoForm.occupation == null || this.personalInfoForm.occupation == '') {
                        callback(new Error('请输入职业'));
                    } else {
                        callback();
                    }
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
                    loginCount: '',
                    creationTime: '',
                    mobileStatus: '0',
                    headPortrait: localStorage.avatorImgPath
                },
                basicValidate: {
                    cellphone: [
                        { required: true, message: '请输入手机号码' },
                        { validator: validePhone }
                    ],
                    nickname:[
                        { required: true, message: '请输入昵称' },
                    ]
                },
                contactInfoForm: {
                    contacts: '',
                    contactsPhone: '',
                    contactsMobile: '',
                    contactsEmail: '',
                    contactsQQ: '',
                    isAlipayBinding: '0', // 未绑定
                    isWxBinding: '0', // 未绑定
                    contactsAddress: []
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
                    ],
                    contactsQQ: [
                        { validator: valideQQ, trigger: 'blur' }
                    ]
                },
                personalInfoForm: {
                    name: '',
                    sex: '',
                    age: '',
                    defaultSelect: '1', // 默认选中学生
                    schoolName: '',
                    schoolAddress: '',
                    income: '',
                    companyName: '',
                    departments: '',
                    occupation: '',
                    selfDescription: ''
                },
                personalInfoValidate: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    sex: [
                        { validator: sexValide }
                    ],
                    age: [
                        { required: true, message: '请输入年龄', trigger: 'blur' },
                        { validator: ageValide }
                    ],
                    schoolName: [
                        { validator: schoolNameValide }
                    ],
                    schoolAddress: [
                        { validator: schoolAddressValide }
                    ],
                    income: [
                        { validator: incomeValide }
                    ],
                    departments: [
                        { validator: departmentValide }
                    ],
                    companyName: [
                        { validator: companyNameValide }
                    ],
                    occupation: [
                        { validator: occupationValide }
                    ]
                },
                cascaderData: [],
                isShowFile: true, // 头像图片可多次上传
                isShowHeadPortrait: false, // 用户头像对话框显示
                bindingModal: false, // 绑定移动app端对话框显示
                bindingModalTitle: '', // 绑定对话框标题
                untieModal: false, // 解绑移动app端对话框显示
                untieModalTitle: '', // 解绑对话框标题
                editIcon: false, // 头像编辑显示
                cropper: {}, // 头像编辑框
                headPortraitList: [
                    {url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3858484478,3500660839&fm=26&gp=0.jpg'},
                    {url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1002919774,3906438198&fm=26&gp=0.jpg'},
                    {url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2344723972,1134179580&fm=26&gp=0.jpg'},
                    {url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1324198412,330510552&fm=26&gp=0.jpg'},
                    {url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=22502317,212960811&fm=26&gp=0.jpg'},
                    {url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548320869342&di=3213aecf3f0838fd471dffd784aa057d&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0132255a604c8da80120121f36db45.gif'},
                    {url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1134728469,27057145&fm=26&gp=0.jpg'},
                    {url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1028410452,465459249&fm=26&gp=0.jpg'},
                    {url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=101925125,1677893626&fm=26&gp=0.jpg'},
                    {url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2792416421,2006182417&fm=26&gp=0.jpg'},
                    {url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1435973750,3806331976&fm=26&gp=0.jpg'},
                    {url: 'https://ps.ssl.qhimg.com/t011ce445f052a006b3.png'}
                ],
                isStudent: true, // 是否学生
                isStaff: false, // 是否员工
                isOther: false, // 是否其他
                isIncome: false, // 收入
                securityCode: "", // 验证码
                userBasicloading: false,
                editPasswordModal: false, // 修改密码模态框显示
                savePassLoading: false,
                bindingDisabled: false, // 是否可点获取验证码
                checkBindingLoading: false,
                checkUntieLoading: false,
                editPasswordForm: {
                    oldPass: '',
                    newPass: '',
                    rePass: '',
                    modifyCode: ''
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
                    ],
                    modifyCode: [
                        { required: true, message: '请输入短信验证码', trigger: 'blur' },
                        { validator: codeValide, trigger: 'blur' }
                    ]
                },
                rePassIcon: false, // 再次输入密码显示图标
                oldPassIcon: false, // 原密码显示图标
                newPassIcon: false, // 新密码显示图标
                showInputCodeDiv: false, // 显示填写验证码div
                bindingContent: '绑定验证码', // “获取验证码”按钮的文字
                untieContent: '解绑验证码',
                untieDisabled: false,
                modifyContent: '获取验证码',
                modifyDisabled: false,
                contactInfoloading: false,
                personalInfoloading: false
            };
    },
    computed: {
            mobileStatusText () {
                if (this.basicForm.mobileStatus == '0') {
                    return '手机未绑定';
                } else {
                    return '手机已绑定';
                }
            }
    },
    methods: {
            initQueryAddress () {
                let url = 'queryAddress';
                let _this = this;
                $util.post(url, {})
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == '10000') {
                                _this.cascaderData = response.data.data;
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
            initPersonalCenter () {
                let url = 'initPersonalCenter';
                let _this = this;
                $util.post(url, {})
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == '10000') {
                                _this.basicForm = response.data.data.basicForm;
                                _this.contactInfoForm = response.data.data.contactInfoForm;
                                _this.personalInfoForm = response.data.data.personalInfoForm;
                                _this.jobInfoSwitch();
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
            getBindingCode () {
                this.$refs['basicForm'].validate((valid) => {
                    if (valid) {
                        this.bindingDisabled = true;
                        let url = 'getSMSCode';
                        let _this = this;
                        let data = qs.stringify({
                            'recipient': this.basicForm.cellphone
                        });
                        $util.post(url, data)
                            .then(function (response) {
                                if (response.status == 200) {
                                    if (response.data.statusCode == '10000') {
                                        let timeLast = 120;
                                        let timer = setInterval(() => {
                                            if (timeLast >= 0) {
                                                _this.bindingContent = timeLast + '秒后重试';
                                                timeLast -= 1;
                                            } else {
                                                clearInterval(timer);
                                                _this.bindingContent = '重新获取';
                                                _this.bindingDisabled = false;
                                            }
                                        }, 1000);
                                        _this.showInputCodeDiv = true;
                                    } else {
                                        _this.bindingDisabled = false;
                                        $util.responseMsg(_this, response.data);
                                    }
                                } else {
                                    _this.bindingDisabled = false;
                                    $util.httpErrorMsg(_this, response.data);
                                }
                            })
                            .catch(function (error) {
                                _this.bindingDisabled = false;
                                $util.httpErrorMsg(_this, error.data);
                            });
                    }
                });
            },
            submitBindingCode () {
                let _this = this;
                _this.checkBindingLoading = true;
                if (this.securityCode.length === 0) {
                    $util.frontErrMsg(_this, 2, '请填写短信验证码');
                } else {
                    let url = 'validateBindingCode';
                    let data = qs.stringify({
                        'recipient': this.basicForm.cellphone,
                        'validateCode': this.securityCode
                    });
                    $util.post(url, data)
                        .then(function (response) {
                            _this.checkBindingLoading = false;
                            if (response.status == 200) {
                                if (response.data.statusCode == '10000') {
                                    $util.frontSuccMsg(_this, 2, '操作成功');
                                    _this.untieContent = '获取解绑验证码';
                                    _this.showInputCodeDiv = false;
                                    _this.securityCode = '';
                                    _this.basicForm.mobileStatus = '1';
                                    let cellphone = _this.basicForm.cellphone;
                                    let hideString = '';
                                    let substring = '';
                                    if (cellphone.length < 6) {
                                        substring = cellphone.substring(cellphone.length / 2, cellphone.length);
                                    } else {
                                        substring = cellphone.substring(3, cellphone.length - 3);
                                    }
                                    for (var i = 0; i < substring.length; i++) {
                                        hideString += '*';
                                    }
                                    _this.basicForm.cellphone = cellphone.replace(substring, hideString);
                                } else {
                                    $util.responseMsg(_this, response.data);
                                }
                            } else {
                                $util.httpErrorMsg(_this, response.data);
                            }
                        })
                        .catch(function (error) {
                            _this.checkBindingLoading = false;
                            $util.httpErrorMsg(_this, error.data);
                        });
                }
            },
            getUntieCode () {
                let url = 'getUntieCode';
                let _this = this;
                $util.post(url, {})
                    .then(function (response) {
                        _this.untieDisabled = true;
                        if (response.status == 200) {
                            if (response.data.statusCode == '10000') {
                                let timeLast = 120;
                                let timer = setInterval(() => {
                                    if (timeLast >= 0) {
                                        _this.untieContent = timeLast + '秒后重试';
                                        timeLast -= 1;
                                    } else {
                                        clearInterval(timer);
                                        _this.untieContent = '重新获取';
                                        _this.untieDisabled = false;
                                    }
                                }, 1000);
                                _this.showInputCodeDiv = true;
                            } else {
                                _this.untieDisabled = false;
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            _this.untieDisabled = false;
                            $util.httpErrorMsg(_this, response.data);
                        }
                    })
                    .catch(function (error) {
                        _this.untieDisabled = false;
                        $util.httpErrorMsg(_this, error.data);
                    });
            },
            submitUntieCode () {
                let _this = this;
                _this.checkUntieLoading = true;
                if (this.securityCode.length === 0) {
                    $util.frontErrMsg(_this, 2, '请填写短信验证码');
                } else {
                    let url = 'validateUntieCode';
                    let data = qs.stringify({
                        'validateCode': this.securityCode
                    });
                    $util.post(url, data)
                        .then(function (response) {
                            _this.checkUntieLoading = false;
                            if (response.status == 200) {
                                if (response.data.statusCode == '10000') {
                                    $util.frontSuccMsg(_this, 2, '操作成功');
                                    _this.bindingContent = '获取验证码';
                                    _this.showInputCodeDiv = false;
                                    _this.securityCode = '';
                                    _this.basicForm.mobileStatus = '0';
                                    _this.basicForm.cellphone = '';
                                } else {
                                    $util.responseMsg(_this, response.data);
                                }
                            } else {
                                $util.httpErrorMsg(_this, response.data);
                            }
                        })
                        .catch(function (error) {
                            _this.checkUntieLoading = false;
                            $util.httpErrorMsg(_this, error.data);
                        });
                }
            },
            showEditPassword () {
                this.editPasswordModal = true;
            },
            showPasswordInput (data) {
                let input = document.getElementById(data);
                if (input.children[2].type == 'text') {
                    input.children[2].type = 'password';
                    if (data == 'oldPassInput') {
                        this.oldPassIcon = false;
                    } else if (data == 'newPassInput') {
                        this.newPassIcon = false;
                    } else if (data == 'rePassInput') {
                        this.rePassIcon = false;
                    }
                } else {
                    input.children[2].type = 'text';
                    if (data == 'oldPassInput') {
                        this.oldPassIcon = true;
                    } else if (data == 'newPassInput') {
                        this.newPassIcon = true;
                    } else if (data == 'rePassInput') {
                        this.rePassIcon = true;
                    }
                }
            },
            getModifyCode () {
                let url = 'getModifyCode';
                let _this = this;
                $util.post(url, {})
                    .then(function (response) {
                        _this.modifyDisabled = true;
                        if (response.status == 200) {
                            if (response.data.statusCode == '10000') {
                                let timeLast = 120;
                                let timer = setInterval(() => {
                                    if (timeLast >= 0) {
                                        _this.modifyContent = timeLast + '秒后重试';
                                        timeLast -= 1;
                                    } else {
                                        clearInterval(timer);
                                        _this.modifyContent = '重新获取';
                                        _this.modifyDisabled = false;
                                    }
                                }, 1000);
                            } else {
                                _this.modifyDisabled = false;
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            _this.modifyDisabled = false;
                            $util.httpErrorMsg(_this, response.data);
                        }
                    })
                    .catch(function (error) {
                        _this.modifyDisabled = false;
                        $util.httpErrorMsg(_this, error.data);
                    });
            },
            showHeadPortrait () {
                this.isShowHeadPortrait = true;
                let img = document.getElementById('cropimg');
                this.cropper = new Cropper(img, {
                    dragMode: 'move', // 定义cropper的拖拽模式。
                    preview: '#preview', // 添加额外的元素(容器)以供预览。
                    guides: true, // 显示在裁剪框上方的虚线。
                    autoCropArea: 0.5, // 定义自动裁剪面积大小(百分比)和图片进行对比。
                    restore: true, // 在调整窗口大小后恢复裁剪的区域。
                    center: true, // 裁剪框在图片正中心。
                    movable: true, // 是否允许可以移动后面的图片
                    highlight: false, // 在裁剪框上方显示白色的区域(突出裁剪框)。
                    cropBoxMovable: true, // 是否通过拖拽来移动剪裁框。
                    zoomOnWheel: false, // 是否可以通过移动鼠标来放大图像。
                    toggleDragModeOnDblclick: true // 当点击两次时可以在“crop”和“move”之间切换拖拽模式。
                });
            },
            headPortraitstatus () {
                this.cropper.destroy();
            },
            handleChange (e) {
                this.isShowFile = false;
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper.replace(reader.result);
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            },
            lookHeadPortrait (data) {
                this.cropper.load(data);
            },
            saveHeadPortrait () {
                let file = this.cropper.getCroppedCanvas().toDataURL();
                let upFile = $util.base64toFile(file, 'headPortrait');
                let url = 'upload';
                let _this = this;
                let param = new window.FormData();
                param.append('file', upFile);
                $util.post(url, param, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == '10000') {
                                _this.basicForm.headPortrait = $util.getWebUrl() + '/' + response.data.data;
                                _this.isShowHeadPortrait = false;
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
            saveEditPass () {
                this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid) {
                        let url = 'modifyPassword';
                        let _this = this;
                        $util.post(url, this.editPasswordForm)
                            .then(function (response) {
                                if (response.status == 200) {
                                    if (response.data.statusCode == '10000') {
                                        _this.savePassLoading = true;
                                        _this.editPasswordModal = false;
                                        $util.frontSuccMsg(_this, 2, '操作成功');
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
                    }
                });
            },
            saveBasic () {
                this.$refs['basicForm'].validate((valid) => {
                    if (valid) {
                        let url = 'saveUserBasic';
                        let _this = this;
                        _this.userBasicloading = true;
                        let data = qs.stringify();
                        $util.post(url, {'userName': this.basicForm.nickname, 'userHeadUrl': this.basicForm.headPortrait})
                            .then(function (response) {
                                if (response.status == 200) {
                                    if (response.data.statusCode == '10000') {
                                        $util.frontSuccMsg(_this, 2, '操作成功');
                                        _this.$store.commit('setAvator', _this.basicForm.headPortrait);
                                        localStorage.setItem('nickname', _this.basicForm.nickname);
                                        _this.userBasicloading = false;
                                    } else {
                                        _this.userBasicloading = false;
                                        $util.responseMsg(_this, response.data);
                                    }
                                } else {
                                    _this.userBasicloading = false;
                                    $util.httpErrorMsg(_this, response.data);
                                }
                            })
                            .catch(function (error) {
                                _this.userBasicloading = false;
                                $util.httpErrorMsg(_this, error.data);
                            });
                    }
                });
            },
            showBindingModal (data) {
                let url;
                let title;
                if (data == 'wx') {
                    $util.frontErrMsg(this, 2, '暂不支持微信，程序员小哥哥正在加紧开发中....');
                    return;
                    title = '微信';
                    url = 'getAlipayLoginPath';
                } else if (data == 'zfb') {
                    title = '支付宝';
                    url = 'getAlipayBindingPath';
                }
                let _this = this;
                $util.post(url, {})
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == '10000') {
                                let url = $util.getWebUrl().replace('http://', '');
                                const wsuri = 'ws://' + url + '/webMessage';// ws地址
                                window.websock = new WebSocket(wsuri);
                                websock.onopen = _this.websocketonopen;
                                websock.onerror = _this.websocketonerror;
                                websock.onmessage = _this.websocketonmessage;
                                websock.onclose = _this.websocketclose;
                                let path = response.data.data;
                                var div = document.getElementById('binding');
                                div.innerHTML = '';
                                let qrcode = new QRCode('binding', {
                                    width: 200,
                                    height: 200, // 高度
                                    text: path // 二维码内容
                                });
                                div.title = '请使用手机' + title + 'APP扫描二维码';
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
            showUntieModal (data) {
                if (data == 'zfb') {
                    this.untieModalTitle = '支付宝';
                } else if (data == 'wx') {
                    this.untieModalTitle = '微信';
                }
                this.untieModal = true;
            },
            websocketonopen () {
                console.log('服务器连接成功！');
            },
            websocketonerror (e) { // 错误
                $util.frontErrMsg(this, 2, '服务器连接异常');
            },
            websocketonmessage (e) { // 数据接收
                const data = JSON.parse(e.data);
                if (data.code != '10000') {
                    $util.frontErrMsg(this, 2, data.msg);
                } else {
                    this.bindingModal = false;
                    this.isAlipayBinding = '1'; // 已绑定
                    $util.frontSuccMsg(this, 2, '账号绑定成功');
                }
            },
            websocketsend (agentData) { // 数据发送
                websock.send(agentData);
            },
            websocketclose (e) { // 关闭
                try {
                    websock.close();
                } catch (e) {}
            },
            bindingModalClose () {
                this.websocketclose();
            },
            saveContactInfo () {
                this.$refs['contactInfoForm'].validate((valid) => {
                    if (valid) {
                        this.contactInfoloading = true;
                        let url = 'saveContactInfo';
                        let _this = this;
                        $util.post(url, this.contactInfoForm)
                            .then(function (response) {
                                if (response.status == 200) {
                                    if (response.data.statusCode == '10000') {
                                        _this.contactInfoloading = false;
                                        $util.frontSuccMsg(_this, 2, '操作成功');
                                    } else {
                                        _this.contactInfoloading = false;
                                        $util.responseMsg(_this, response.data);
                                    }
                                } else {
                                    _this.contactInfoloading = false;
                                    $util.httpErrorMsg(_this, response.data);
                                }
                            })
                            .catch(function (error) {
                                _this.contactInfoloading = false;
                                $util.httpErrorMsg(_this, error.data);
                            });
                    }
                });
            },
            jobInfoSwitch () {
                this.isStudent = false; // 是否学生
                this.isStaff = false; // 是否员工
                this.isOther = false; // 是否其他
                this.isIncome = false; // 收入
                if (this.personalInfoForm.defaultSelect == '1') {
                    this.isStudent = true;
                } else if (this.personalInfoForm.defaultSelect == '2') {
                    this.isStaff = true;
                    this.isIncome = true;
                } else if (this.personalInfoForm.defaultSelect == '0') {
                    this.isOther = true;
                    this.isIncome = true;
                }
            },
            savePersonalInfo () {
                this.$refs['personalInfoForm'].validate((valid) => {
                    if (valid) {
                        this.personalInfoloading = true;
                        let url = 'savePersonalInfo';
                        let _this = this;
                        $util.post(url, this.personalInfoForm)
                            .then(function (response) {
                                if (response.status == 200) {
                                    if (response.data.statusCode == '10000') {
                                        _this.personalInfoloading = false;
                                        $util.frontSuccMsg(_this, 2, '操作成功');
                                    } else {
                                        _this.personalInfoloading = false;
                                        $util.responseMsg(_this, response.data);
                                    }
                                } else {
                                    _this.personalInfoloading = false;
                                    $util.httpErrorMsg(_this, response.data);
                                }
                            })
                            .catch(function (error) {
                                _this.personalInfoloading = false;
                                $util.httpErrorMsg(_this, error.data);
                            });
                    }
                });
            }
    },
    mounted () {
            this.initPersonalCenter();
            this.initQueryAddress();
    }
};
</script>
