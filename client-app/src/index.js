import React, { Component } from 'react'
import 'antd/dist/antd.css'
import { connect } from 'react-redux'
// import { BannerModel } from '@/models'
import Login from './page/login'
import './index.css'
class App extends Component {
    componentDidMount () {
        // const { fetchBanners } = this.props
        // console.log('componentDidMount', this.props)
        // fetchBanners('12', '34')
    }
    render () {
        return <>
            <Login/>
        </>
    }
}
const mapStateToProps = (state, props) => {
    console.log('state123', state)
    // const { getBanners } = BannerModel.selectors(state)
    return {
        // getBanners: getBanners()
    }
}
const mapDispatchProps = (dispatch, props) => {
    console.log('dispatch', dispatch)
    return {
    }
}
// const { fetchBanners } = BannerModel.actions
export default connect(mapStateToProps, mapDispatchProps)(App)