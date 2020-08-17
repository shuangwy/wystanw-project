import React, { Component } from 'react'
import 'antd/dist/antd.css'
import { Input, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux'
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
const mapStateToProps = () => {

}
const mapDispatchToProps = () => {

}
export default connect(mapStateToProps, mapDispatchToProps)(App)