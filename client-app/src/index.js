import React, { Component } from 'react'
import 'antd/dist/antd.css'
// import { Input, Space } from 'antd';
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux'
import { BannerModel } from '@/models'
import Login from './page/login'
class App extends Component {
    componentDidMount () {
        // let xhr = new XMLHttpRequest()
        // xhr.open("GET", '/api/blog/list', true)
        // xhr.onreadystatechange = () => {
        //     // console.log(xhr.response)
        // }
        // xhr.send()
        const { fetchBanners } = this.props
        console.log('componetDidMount', this.props)
        fetchBanners('12', '34')
    }
    render () {
        return <>
            <Login/>
            {/* <Space direction="vertical">
                账号<Input.Password placeholder="input password" />
                密码<Input.Password
                    placeholder="input password"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Space> */}
        </>
    }
}
const mapStateToProps = (state, ownProps) => {
    const { getBanners } = BannerModel.selectors(state)
    return {
        getBanners: getBanners()
    }
}
const { fetchBanners } = BannerModel.actions

export default connect(mapStateToProps, { fetchBanners })(App)