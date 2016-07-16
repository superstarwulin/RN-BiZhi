/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  Component
} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
  ListView,
  TouchableHighlight,
  View,
  InteractionManager,
  RefreshControl,
} from 'react-native';

import {
  home
} from '../actions/homeAction';
import Common from '../common/common';
import Loading from '../common/Loading';
import LoadMoreFooter from '../common/LoadMoreFooter';


let limit = 21;
let offest = '';
let tag = '';
let isLoadMore = false;
let isRefreshing = false;
let isLoading = true;
class Home extends Component {

  constructor(props) {
    super(props); //这一句不能省略，照抄即可
    this._renderRow = this._renderRow.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const {
        dispatch
      } = this.props;
      dispatch(home(tag, offest, limit, isLoadMore, isRefreshing, isLoading));
    })
  }

  render() {
    const {
      Home
    } = this.props;
    let homeList = Home.HomeList;
    console.log(Home);
    // if (!this.state.loaded) {
    //   return this.renderLoadingView();
    // }


    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>主页</Text>
        </View>
        {Home.isLoading ? <Loading /> :
          <ListView
            dataSource={this.state.dataSource.cloneWithRows(homeList) }
            renderRow={this._renderRow}
            contentContainerStyle={styles.list}
            enableEmptySections={true}
            initialListSize= {15}
            onScroll={this._onScroll}
            onEndReached={this._onEndReach.bind(this) }
            onEndReachedThreshold={10}
            renderFooter={this._renderFooter.bind(this) }
            style={styles.listView}
            refreshControl={
              <RefreshControl
                refreshing={Home.isRefreshing}
                onRefresh={this._onRefresh.bind(this) }
                title="正在加载中……"
                color="#ccc"
                />
            }
            />
        }
      </View>

    );

  }


  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          正在网络上获取电影数据……
        </Text>
      </View>
    );
  }

  _renderRow(rowDate) {
    // console.log('http://img.hb.aicdn.com/' + rowDate.file.key + '_fw236');

    return (
      <View style={styles.container}>
        <Image
          source={{ uri: 'http://img.hb.aicdn.com/' + rowDate.file.key + '_fw236' }}
          style={styles.thumbnail}
          />
      </View>
    );
  }

  _renderFooter() {
    const {Home} = this.props;
    if (Home.isLoadMore) {
      return <LoadMoreFooter />
    }
  }

  _onScroll() {
    if (!isLoadMore) isLoadMore = true;
  }

  // 下拉刷新
  _onRefresh() {
    if (isLoadMore) {
      const {dispatch,Home} = this.props;
      isLoadMore = false;
      isRefreshing = true;
      dispatch(home('', '', limit, isLoadMore, isRefreshing, isLoading));
      

    }
  }

  // 上拉加载
  _onEndReach() {

    InteractionManager.runAfterInteractions(() => {
      const {dispatch,Home} = this.props;
      let homeList = Home.HomeList;
      isLoadMore = true;
      isLoading = false;
      offest = homeList[homeList.length - 1].seq
      dispatch(home(tag, offest, limit, isLoadMore, isRefreshing, isLoading));
    })

  }

}


const styles = StyleSheet.create({
  container: {
    width: Common.window.width / 3,
    height: Common.window.width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listView: {
    backgroundColor: '#F5FCFF',
    height: Common.window.height - 44 - 60 - 20,
  },
  thumbnail: {
    width: Common.window.width / 3 - 10,
    height: Common.window.width / 2 - 10,

  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',

  },
  header: {
    marginTop: 20,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
  },
});

module.exports = Home;