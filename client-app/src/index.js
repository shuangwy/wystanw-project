// require('./index.less')

// let xhr = new XMLHttpRequest()
// xhr.open("GET", '/api/user', true)

// xhr.onload=()=>{
//     console.log(xhr.response)
// }
// xhr.send()

// let url 
// if(SERVICE_URL){
//     url = 'http://localhost:8080'
// }else{
//     url = 'https://wyshuang.com'`
// }

import React, { Component } from 'react'
import { Input, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './index.less'
class App extends Component {
    render() {
        return <>
            <Space direction="vertical">
                账号<Input.Password placeholder="input password" />
                密码<Input.Password
                    placeholder="input password"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Space>
            <div className={styles.antbody}>
                你好啊 啥棍哥
            </div>
        </>
    }
}
export default App