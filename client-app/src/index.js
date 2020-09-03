import React, { Component } from 'react'
import 'antd/dist/antd.css'
// import { Input, Space } from 'antd';
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux'
import { BannerModel } from '@/models'
import Login from './page/login'
import './index.css'
class App extends Component {
    componentDidMount () {
        // const { fetchBanners } = this.props
        // console.log('componetDidMount', this.props)
        // fetchBanners('12', '34')
    }
    render () {
        return <>
            <Login/>
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