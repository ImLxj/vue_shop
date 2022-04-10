/*
 * @Author: 呲牙
 * @LastEditors: 呲牙
 * @Date: 2022-04-09 14:21:43
 * @LastEditTime: 2022-04-10 14:34:01
 * @Email: 1340482172@qq.com
 * @FilePath: \vue_shop\src\plugins\element.js
 * @Environment: Win 10 Python 3.8
 * @Description: 
 */

import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Message,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  Upload,
  Timeline,
  TimelineItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

// 将弹框组件挂载到Vue身上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
