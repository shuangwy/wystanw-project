import React, { Component } from 'react'
import { Input, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
class App extends Component {
    componentDidMount() {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", '/api/blog/list', true)
        xhr.onreadystatechange = () => {
            console.log(xhr.response)
        }
        xhr.send()
    }
    render() {
        return <>
            <Space direction="vertical">
                账号<Input.Password placeholder="input password" />
                密码<Input.Password
                    placeholder="input password"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Space>
        </>
    }
}
export default App